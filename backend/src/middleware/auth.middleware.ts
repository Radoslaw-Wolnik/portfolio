// src/middleware/auth.middleware.ts

import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import RevokedToken from '../models/revoked-token.model';
import User, { IUserDocument } from '../models/user.model';
import { UnauthorizedError, ForbiddenError, NotFoundError, ExpiredTokenError, InvalidTokenError, ServiceUnavailableError, InternalServerError } from '../utils/custom-errors.util';


// Helper function to generate a short-lived token
export const generateShortLivedToken = (user: IUserDocument): string => {
  return jwt.sign(
    { userId: user._id, shortLived: true },
    process.env.JWT_SECRET!,
    { expiresIn: '5m' }
  );
};

// Helper function to set a short-lived token as a cookie
export const setShortLivedTokenCookie = (res: Response, token: string): void => {
  res.cookie('shortLivedToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 300000
  });
};

export const generateToken = (user: IUserDocument): string => {
  return jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
};

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    //secure: process.env.NODE_ENV === 'production', // Use secure in production
    secure: true,
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour in milliseconds
  });
};

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthorizedError('Access denied. No token provided.');
  }

  try {
    // Check if the token has been revoked
    const revokedToken = await RevokedToken.findOne({ token: token });
    if (revokedToken) {
      throw new InvalidTokenError('Token has been revoked.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.user.id);
    if (!user) {
      throw new NotFoundError('User');
    }

    req.user = user; // Attach the full user object
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenError();
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidTokenError();
    } else {
      throw new InternalServerError();
    }
  }
};

export const isOwner = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    throw new ForbiddenError('Owner privileges required.');
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ForbiddenError('Admin privileges required.');
  }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthorizedError('No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.user.id);

    if (!user) {
      throw new NotFoundError('User');
    }

    /* Check if the user's email is verified
     * if (!user.isVerified) {
     *   return res.status(403).json({ message: 'Email not verified. Please verify your email to continue.' });
     * }
    */

    const newToken = generateToken(user);
    setTokenCookie(res, newToken);

    res.json({ message: 'Token refreshed successfully', user: { id: user._id, role: user.role } });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenError();
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidTokenError();
    } else {
      throw new InternalServerError();
    }
  }
};


export const handlePostRegistrationAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const shortLivedToken = req.cookies.shortLivedToken;

  if (!shortLivedToken) {
    throw new UnauthorizedError('No short-lived token provided.');
  }

  try {
    const decoded = jwt.verify(shortLivedToken, process.env.JWT_SECRET!) as JwtPayload;
    
    if (!decoded.shortLived) {
      throw new InvalidTokenError('Invalid short-lived token.');
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    // Clear the short-lived token cookie
    res.clearCookie('shortLivedToken');

    // Set the user on the request object
    req.user = user;

    // Generate and set a regular session token
    const sessionToken = generateToken(user);
    setTokenCookie(res, sessionToken);

    // Proceed to the next middleware
    next();

  } catch (error) {
    // clear invalid short-lived token
    res.clearCookie('shortLivedToken');
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenError();
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidTokenError('Invalid or expired short-lived token.');
    } else {
      throw new InternalServerError();
    }
  }
};
