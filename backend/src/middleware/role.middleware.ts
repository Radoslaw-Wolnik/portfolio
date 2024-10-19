import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/custom-errors.util';

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ForbiddenError('Admin privileges required.');
  }
};