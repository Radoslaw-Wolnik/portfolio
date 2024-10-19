import { Response, NextFunction } from 'express';
import { dockerSessionService } from '../services/docker-session.service';
import { projectService } from '../services/project.service';
import { NotFoundError, BadRequestError, InternalServerError, UnauthorizedError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
// import { AuthRequest } from '../types/global';

export const createSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId, username } = req.body;
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    if (!req.user.id){
      throw(UnauthorizedError);
    }
    const session = await dockerSessionService.createSession(req.user!.id, project.name, username);
    logger.info(`Docker session created`, { userId: req.user!._id, projectName: project.name, username });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessions = await dockerSessionService.listUserSessions(req.user!.id);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const getAllActiveSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      throw new BadRequestError('Only admins can view all active sessions');
    }
    const sessions = await dockerSessionService.listAllActiveSessions();
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const terminateSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;
    await dockerSessionService.terminateSession(sessionId);
    logger.info(`Docker session terminated`, { sessionId, userId: req.user!.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getSessionStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      throw new BadRequestError('Only admins can view session statistics');
    }
    const stats = await dockerSessionService.getSessionStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};