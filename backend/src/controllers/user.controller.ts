import { Response, NextFunction } from 'express';
import User from '../models/user.model';
import { UnauthorizedError, NotFoundError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedError('User not authenticated');
    }

    const userWithoutPassword = req.user.toObject();
    delete userWithoutPassword.password;

    logger.debug('User retrieved profile', { userId: req.user._id });
    res.json(userWithoutPassword);
  } catch (error) {
    next(error instanceof Error ? error : new InternalServerError('Error fetching user profile'));
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedError('User not authenticated');
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { username: req.body.username }, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    logger.info('User profile updated', { userId: req.user._id });
    res.json(updatedUser);
  } catch (error) {
    next(error instanceof Error ? error : new InternalServerError('Error updating user profile'));
  }
};