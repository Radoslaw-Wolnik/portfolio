import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/global';
import { dockerSessionService } from '../services/docker-session.service';
import { NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';


export const createSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName, username } = req.body;
    const session = await dockerSessionService.createSession(req.user!.id, projectName, username);
    logger.info(`Docker session created`, { userId: req.user!._id, projectName, username });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
}

export const getSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await dockerSessionService.getSession(req.params.sessionId);
    res.json(session);
  } catch (error) {
    next(error);
  }
}

export const listUserSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessions = await dockerSessionService.listUserSessions(req.user!.id);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
}

export const terminateSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await dockerSessionService.terminateSession(req.params.sessionId);
    logger.info(`Docker session terminated`, { sessionId: req.params.sessionId, userId: req.user!._id });
    res.json({ message: 'Session terminated successfully' });
  } catch (error) {
    next(error);
  }
}

export const getSessionStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await dockerSessionService.getSessionStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export const swapUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const { newUsername } = req.body;
    const updatedSession = await dockerSessionService.swapUser(sessionId, newUsername);
    logger.info(`User swapped in Docker session`, { sessionId, newUsername, userId: req.user!._id });
    res.json(updatedSession);
  } catch (error) {
    next(error);
  }
}
