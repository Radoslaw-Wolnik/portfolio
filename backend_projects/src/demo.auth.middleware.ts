import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const demoAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== 'demo') {
      return res.status(401).json({ message: 'Invalid token type' });
    }
    req.user = {
      username: decoded.username,
      role: decoded.role,
      projectId: decoded.projectId
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};