import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/global';
import User from '../models/user.model';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username } = req.body;

    const user = await User.findById(req.user!._id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (username) user.username = username;

    await user.save();
    logger.info('User profile updated', { userId: req.user!._id });

    const updatedUserResponse = user.toJSON();
    res.json(updatedUserResponse);
  } catch (error) {
    next(error);
  }
};