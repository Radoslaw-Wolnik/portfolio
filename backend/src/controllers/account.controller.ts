// src/controllers/account.controller.ts
import { Request, Response } from 'express';
import { UnauthorizedError, NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.util';
import jwt from 'jsonwebtoken';

export const updateAccount = async (req: Request, res: Response) => {

  // find user by id
  const updateData = req.body;
  const userId = req.user!.id;

  if (!req.user.id){

  }


  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  logger.info(`Account updated for user: ${userId}`);
  res.json(user);
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const userId = req.user!.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new BadRequestError('Current password is incorrect');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  logger.info(`Password changed for user: ${userId}`);

  res.json({ message: 'Password changed successfully' });
};

export const deleteAccount = async (req: Request, res: Response) => {

  const userId = req.user!.id;

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  logger.info(`Account deleted for user: ${userId}`);

  res.status(204).send();
};
