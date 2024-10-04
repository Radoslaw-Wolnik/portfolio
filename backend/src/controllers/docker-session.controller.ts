import { Request, Response, NextFunction } from 'express';
import DockerSession, { IDockerSessionDocument } from '../models/docker-session.model';
import { NotFoundError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const startDockerSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName, userRole } = req.body;
    const ipAddress = req.ip;
    const session = new DockerSession({
      projectName,
      userRole,
      ipAddress,
      startTime: new Date(),
    });
    await session.save();
    logger.info('Docker session started', { sessionId: session._id, projectName, userRole });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const endDockerSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await DockerSession.findById(req.params.id);
    if (!session) {
      throw new NotFoundError('Docker session not found');
    }
    session.endTime = new Date();
    session.duration = (session.endTime.getTime() - session.startTime.getTime()) / 1000; // duration in seconds
    await session.save();
    logger.info('Docker session ended', { sessionId: session._id, duration: session.duration });
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const getDockerSessionStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalSessions = await DockerSession.countDocuments();
    const averageDuration = await DockerSession.aggregate([
      { $match: { duration: { $exists: true } } },
      { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
    ]);
    const projectStats = await DockerSession.aggregate([
      { $group: { _id: '$projectName', count: { $sum: 1 } } }
    ]);
    res.json({
      totalSessions,
      averageDuration: averageDuration[0]?.avgDuration || 0,
      projectStats
    });
  } catch (error) {
    next(error);
  }
};


// docker-session.controller.ts
import { Request, Response } from 'express';
import { dockerSessionService } from '../services/docker-session.service';
import { portfolioAuthService } from '../services/portfolio-auth.service';

export class DockerSessionController {
  async startSession(req: Request, res: Response) {
    try {
      const { projectName, username, role } = req.body;
      const session = await dockerSessionService.createSession(projectName, req.user.id);
      const token = await portfolioAuthService.createDemoToken(session.id, username, role);
      res.json({ sessionId: session.id, token });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start session' });
    }
  }

  async stopSession(req: Request, res: Response) {
    try {
      await dockerSessionService.stopSession(req.params.sessionId);
      res.json({ message: 'Session stopped successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to stop session' });
    }
  }

  async getSessionStatus(req: Request, res: Response) {
    try {
      const status = await dockerSessionService.getSessionStatus(req.params.sessionId);
      res.json({ status });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get session status' });
    }
  }
}

export const dockerSessionController = new DockerSessionController();