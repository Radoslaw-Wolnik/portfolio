import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import enviorement from './enviorement';

const AUTH_SECRET = enviorement.AUTH_SECRET; // This should be set securely

export const authenticateDemoUser = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.demoAuth;

  if (!token) {
    return res.status(401).json({ message: 'No authentication cookie provided' });
  }

  try {
    const decoded = jwt.verify(token, AUTH_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication cookie' });
  }
};
