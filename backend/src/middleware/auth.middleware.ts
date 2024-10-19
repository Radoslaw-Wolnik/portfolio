import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/custom-errors.util';
import User, { IUserDocument } from '../models/user.model';
import DemoUser, { IDemoUser } from '../models/demo-user.model';
import environment from '../config/environment';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.auth_token || req.cookies.demo_auth_token;
  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }

  jwt.verify(token, environment.auth.jwtSecret, async (err: any, decoded: any) => {
    if (err) {
      return next(new UnauthorizedError('Invalid token'));
    }

    try {
      if (decoded.type === 'demo') {
        const demoUser = await DemoUser.findOne({ _id: decoded.id, project: decoded.projectId });
        if (!demoUser) {
          return next(new UnauthorizedError('Demo user not found'));
        }
        (req as AuthRequest).user = demoUser as IDemoUser;
        (req as AuthRequest).isDemo = true;
      } else {
        const user = await User.findOne({ _id: decoded.id });
        if (!user) {
          return next(new UnauthorizedError('User not found'));
        }
        (req as AuthRequest).user = user as IUserDocument;
        (req as AuthRequest).isDemo = false;
      }
      next();
    } catch (error) {
      next(new UnauthorizedError('Authentication failed'));
    }
  });
};