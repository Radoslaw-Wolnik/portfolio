import { Request } from 'express';
import { IUserDocument } from '../models/user.model';
import { IDemoUser } from '../models/demo-user.model';

declare global {
  interface AuthRequest extends Request {
    user?: IUserDocument | IDemoUser;
    isDemo?: boolean;
  }
}

export {};