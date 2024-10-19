// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/custom-errors.util';
import User from '../models/user.model';
import DemoUser from '../models/demo-user.model';

export interface AuthRequest extends Request {
  user?: any;
  isDemo?: boolean;
}

// change to https cookies

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.type === 'demo') {
      const demoUser = await DemoUser.findOne({ _id: decoded.id, project: decoded.projectId });
      if (!demoUser) {
        throw new UnauthorizedError('Demo user not found');
      }
      req.user = demoUser;
      req.isDemo = true;
    } else {
      const user = await User.findOne({ _id: decoded.id });
      if (!user) {
        throw new UnauthorizedError('User not found');
      }
      req.user = user;
      req.isDemo = false;
    }

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};

