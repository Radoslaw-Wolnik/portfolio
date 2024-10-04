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

interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

export const login = async (req: LoginRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new UnauthorizedError('Username and password are required');
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Failed login attempt', { username: req.body.username });
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      environment.auth.jwtSecret,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: environment.app.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    logger.info('User logged in successfully', { userId: user._id });
    res.json({ message: 'Login successful', user: { id: user._id, role: user.role } });
  } catch (error) {
    next(error instanceof Error ? error : new InternalServerError('Login failed'));
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('token');
    logger.info('User logged out');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(new InternalServerError('Error during logout'));
  }
};