import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, BadRequestError } from '../utils/custom-errors.util';
import User from '../models/user.model';
import DemoUser from '../models/demo-user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import { AuthRequest } from '../types/global';
import environment from '../config/environment';
import logger from '../utils/logger.util';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, environment.auth.jwtSecret, { expiresIn: '1d' });
    res.cookie('auth_token', token, { httpOnly: true, secure: environment.app.nodeEnv === 'production' });
    res.json({ user: { id: user._id, username: user.username, role: user.role }, message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
};

export const loginDemo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password, projectId } = req.body;
    const demoUser = await DemoUser.findOne({ username, project: projectId });
    if (!demoUser || !(await bcrypt.compare(password, demoUser.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign({ id: demoUser._id, projectId, type: 'demo' }, environment.auth.jwtSecret, { expiresIn: '1h' });
    res.cookie('demo_auth_token', token, { httpOnly: true, secure: environment.app.nodeEnv === 'production' });
    res.json({ demoUser: { id: demoUser._id, username: demoUser.username, role: demoUser.role }, message: 'Logged in as demo user' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.auth_token || req.cookies.demo_auth_token;
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, environment.auth.jwtSecret) as any;
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
      { id: user._id, ...(decoded.type === 'demo' ? { projectId: decoded.projectId, type: 'demo' } : { role: user.role }) },
      environment.auth.jwtSecret,
      { expiresIn: decoded.type === 'demo' ? '1h' : '1d' }
    );

    res.cookie(decoded.type === 'demo' ? 'demo_auth_token' : 'auth_token', newToken, { httpOnly: true, secure: environment.app.nodeEnv === 'production' });
    res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.auth_token || req.cookies.demo_auth_token;
    if (!token) {
      throw new BadRequestError('No token provided');
    }
    
    res.clearCookie('auth_token');
    res.clearCookie('demo_auth_token');
    logger.info('User logged out', { userId: req.user?._id });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};