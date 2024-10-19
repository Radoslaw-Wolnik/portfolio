import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/global';
import { UnauthorizedError, NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.util';


export const updateAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updateData = req.body;
    const userId = req.user!._id;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    logger.info(`Account updated for user: ${userId}`);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export const changePassword = async(req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    logger.info(`Password changed for user: ${userId}`);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
}

export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    logger.info(`Account deleted for user: ${userId}`);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}