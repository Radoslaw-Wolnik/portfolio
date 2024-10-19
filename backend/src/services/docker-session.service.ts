import { v4 as uuidv4 } from 'uuid';
import { dockerService } from './docker.service';
import DockerSession, { IDockerSession } from '../models/docker-session.model';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import mongoose from 'mongoose';

class DockerSessionService {
  async createSession(userId: string, projectName: string, username: string): Promise<IDockerSession> {
    try {
      const sessionId = uuidv4();
      const containerSessionId = await dockerService.createUserSession(projectName, username);

      const session = new DockerSession({
        sessionId,
        userId,
        projectName,
        username,
        containerSessionId,
        startTime: new Date(),
        status: 'active'
      });

      await session.save();
      logger.info(`Docker session created: ${sessionId}`, { userId, projectName, username });
      return session;
    } catch (error) {
      logger.error('Failed to create Docker session', error);
      throw new InternalServerError('Failed to create Docker session');
    }
  }

  async getSession(sessionId: string): Promise<IDockerSession> {
    const session = await DockerSession.findOne({ sessionId });
    if (!session) {
      throw new NotFoundError('Docker session not found');
    }
    return session;
  }

  async listUserSessions(userId: string): Promise<IDockerSession[]> {
    return DockerSession.find({ userId, status: 'active' });
  }

  async listAllActiveSessions(): Promise<IDockerSession[]> {
    return DockerSession.find({ status: 'active' });
  }

  async switchUser(sessionId: string, newUsername: string): Promise<IDockerSession> {
    const session = await this.getSession(sessionId); // Fetch the session from MongoDB
    if (session.status !== 'active') {
      throw new BadRequestError('Cannot switch user on an inactive session');
    }

    try {
      // Switch the user in the Docker container via dockerService
      await dockerService.switchUser(session.containerSessionId, newUsername);
      
      // Update session details
      session.username = newUsername; // Change the username
      session.lastSwitchTime = new Date(); // Update the last switch timestamp
      await session.save(); // Save the updated session in the database

      logger.info(`User switched in Docker session: ${sessionId}`, { newUsername });
      return session; // Return the updated session object
    } catch (error) {
      logger.error(`Failed to switch user in Docker session: ${sessionId}`, error);
      throw new InternalServerError('Failed to switch user in Docker session');
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session.status !== 'active') {
      throw new BadRequestError('Session is already inactive');
    }

    try {
      await dockerService.terminateUserSession(session.containerSessionId);
      
      session.status = 'terminated';
      session.endTime = new Date();
      await session.save();

      logger.info(`Docker session terminated: ${sessionId}`);
    } catch (error) {
      logger.error(`Failed to terminate Docker session: ${sessionId}`, error);
      throw new InternalServerError('Failed to terminate Docker session');
    }
  }

  async cleanupInactiveSessions(): Promise<IDockerSession[]> {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    try {
      const inactiveSessions = await DockerSession.find({
        $or: [
          { status: 'terminated' },
          { status: 'active', lastActivityTime: { $lt: cutoffTime } }
        ]
      });

      for (const session of inactiveSessions) {
        await this.terminateSession(session.sessionId);
      }

      logger.info(`Cleaned up ${inactiveSessions.length} inactive Docker sessions`);
      return inactiveSessions;
    } catch (error) {
      logger.error('Failed to clean up inactive Docker sessions', error);
      throw new InternalServerError('Failed to clean up inactive Docker sessions');
    }
  }

  async getSessionStats(): Promise<any> {
    try {
      const totalSessions = await DockerSession.countDocuments();
      const activeSessions = await DockerSession.countDocuments({ status: 'active' });
      const avgSessionDuration = await DockerSession.aggregate([
        { $match: { status: 'terminated' } },
        { $project: { duration: { $subtract: ['$endTime', '$startTime'] } } },
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
      ]);

      return {
        totalSessions,
        activeSessions,
        avgSessionDuration: avgSessionDuration[0]?.avgDuration || 0
      };
    } catch (error) {
      logger.error('Failed to get session stats', error);
      throw new InternalServerError('Failed to get session statistics');
    }
  }
}

export const dockerSessionService = new DockerSessionService();