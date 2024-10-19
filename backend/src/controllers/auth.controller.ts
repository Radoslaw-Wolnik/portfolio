// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { UnauthorizedError } from '../utils/custom-errors.util';
import User from '../models/user.model';
import DemoUser from '../models/demo-user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ user, token });
};

export const loginDemo = async (req: Request, res: Response) => {
  const { username, password, projectId } = req.body;
  const demoUser = await DemoUser.findOne({ username, project: projectId });
  if (!demoUser || !(await bcrypt.compare(password, demoUser.password))) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign({ id: demoUser._id, projectId, type: 'demo' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  res.json({ demoUser, token });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // <-------------------- change to cookie based authentication
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    let user;

    if (decoded.type === 'demo') {
      user = await DemoUser.findOne({ _id: decoded.id, project: decoded.projectId });
    } else {
      user = await User.findOne({ _id: decoded.id });
    }

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const newToken = jwt.sign(
      { id: user._id, ...(decoded.type === 'demo' ? { projectId: decoded.projectId, type: 'demo' } : {}) },
      process.env.JWT_SECRET!,
      { expiresIn: decoded.type === 'demo' ? '1h' : '1d' }
    );

    res.json({ token: newToken });
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new UnauthorizedError('No token provided');
  }
  // token <-------------------------------------------- blackmaile the token or sth like that
  res.json({ message: 'Logged out successfully' });
};