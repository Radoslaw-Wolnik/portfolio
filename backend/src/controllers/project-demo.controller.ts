import { Request, Response, NextFunction } from 'express';
import { projectDemoService } from '../services/project-demo.service';
import { CustomError, BadRequestError } from '../utils/custom-errors.util';

export const startProjectDemo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectName, username } = req.body;
    const { session, token, port, demoCookieValue, credentials } = await projectDemoService.startSession(projectName, username);
      
    // Set the demo authentication cookie
    res.cookie('demoAuth', demoCookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });
  
    res.json({
      message: 'Project demo started',
      sessionId: session._id,
      token,
      demoUrl: `http://localhost:${port}`,
      credentials
    });
  } catch (error) {
    next(error instanceof CustomError ? error : new BadRequestError('Failed to start demo'));
  }
};

export const switchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const { newUsername } = req.body;
    const { token, credentials } = await projectDemoService.switchUser(sessionId, newUsername);
    res.json({ 
      message: 'Switched user successfully', 
      token,
      credentials
    });
  } catch (error) {
    next(error instanceof CustomError ? error : new BadRequestError('Failed to switch user'));
  }
};

export const getProjectDemoStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const status = await projectDemoService.getSessionStatus(sessionId);
    res.json(status);
  } catch (error) {
    next(error instanceof CustomError ? error : new BadRequestError('Failed to get demo status'));
  }
};

export const endProjectDemo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    await projectDemoService.endSession(sessionId);
    res.json({ message: 'Project demo ended successfully' });
  } catch (error) {
    next(error instanceof CustomError ? error : new BadRequestError('Failed to end demo'));
  }
};