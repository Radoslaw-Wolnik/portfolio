import { Response, NextFunction } from 'express';
import { dockerSessionService } from '../services/docker-session.service';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const createSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName, username } = req.body;
    const session = await dockerSessionService.createSession(req.user._id, projectName, username);
    logger.info(`Docker session created`, { userId: req.user._id, projectName, username });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessions = await dockerSessionService.listUserSessions(req.user._id);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const switchUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId, newUsername } = req.body;
    const updatedSession = await dockerSessionService.switchUser(sessionId, newUsername);
    logger.info(`User switched in Docker session`, { sessionId, newUsername, userId: req.user._id });
    res.json(updatedSession);
  } catch (error) {
    next(error);
  }
};

export const terminateSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;
    await dockerSessionService.terminateSession(sessionId);
    logger.info(`Docker session terminated`, { sessionId, userId: req.user._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const terminateAllSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessions = await dockerSessionService.listUserSessions(req.user._id);
    for (const session of sessions) {
      await dockerSessionService.terminateSession(session.sessionId);
    }
    logger.info(`All Docker sessions terminated for user`, { userId: req.user._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};