import { Request } from 'express';
import { Types } from 'mongoose';
import { IUserDocument } from '../models/user.model';

declare global {
  interface AuthRequest extends Request {
    user: IUserDocument;
    isDemo?: boolean;
  }
}

export {};