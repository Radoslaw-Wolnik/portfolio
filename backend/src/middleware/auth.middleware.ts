import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/custom-errors.util';
import environment from '../config/environment';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, environment.auth.jwtSecret, (err, user) => {
      if (err) {
        return next(new UnauthorizedError('Invalid token'));
      }

      req.user = user;
      next();
    });
  } else {
    next(new UnauthorizedError('Authorization header missing'));
  }
};

export interface AuthRequest extends Request {
  user: {
    userId: string;
    sessionId: string;
    role: string;
  };
}

export const authenticateDemoSession = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, environment.auth.jwtSecret, (err, decoded: any) => {
      if (err) {
        return next(new UnauthorizedError('Invalid token'));
      }

      if (!decoded.sessionId || !decoded.userId || !decoded.role) {
        return next(new UnauthorizedError('Invalid demo session token'));
      }

      req.user = {
        userId: decoded.userId,
        sessionId: decoded.sessionId,
        role: decoded.role
      };
      next();
    });
  } else {
    next(new UnauthorizedError('Authorization header missing'));
  }
};