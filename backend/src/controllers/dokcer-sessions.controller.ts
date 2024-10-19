// src/controllers/session.controller.ts
import { Request, Response } from 'express';
import DockerSession, { IDockerSession } from '../models/docker-session.model';
import { NotFoundError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const createSession = async (req: Request, res: Response) => {
  const sessionData = req.body;
  const session = new DockerSession(sessionData);
  await session.save();
  logger.info(`Session created for user: ${session.userId}`);
}

export const getUserSessions = async (req: Request, res: Response) => {
  const userId = req.user!.id
  const sessions =  DockerSession.find({ userId });
  res.json(sessions);
};

export const deleteSession = async (req: Request, res: Response) => {
  const sessionId = req.params.id;
  const session = await DockerSession.findByIdAndDelete(sessionId);
  if (!session) {
    throw new NotFoundError('Session not found');
  }
  logger.info(`Session deleted: ${sessionId}`);

  res.status(204).send();
};

export const deleteAllSessions = async (req: Request, res: Response) => {
  const userId = req.user!.id
  await DockerSession.deleteMany({ userId });
  logger.info(`All sessions deleted for user: ${userId}`);
  res.status(204).send();
};