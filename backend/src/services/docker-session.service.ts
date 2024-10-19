import { v4 as uuidv4 } from 'uuid';
import { dockerService } from './docker.service';
import DockerSession from '../models/docker-session.model';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import { IDockerSession } from '../models/docker-session.model';

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

  async switchUser(sessionId: string, newUsername: string): Promise<IDockerSession> {
    const session = await this.getSession(sessionId);
    if (session.status !== 'active') {
      throw new BadRequestError('Cannot switch user on an inactive session');
    }

    try {
      const { token, credentials } = await dockerService.switchUser(session.containerSessionId, newUsername);
      
      session.username = newUsername;
      session.lastSwitchTime = new Date();
      await session.save();

      logger.info(`User switched in Docker session: ${sessionId}`, { newUsername });
      return session;
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

  async cleanupInactiveSessions(): Promise<void> {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    try {
      const result = await DockerSession.deleteMany({
        $or: [
          { status: 'terminated' },
          { status: 'active', lastActivityTime: { $lt: cutoffTime } }
        ]
      });
      logger.info(`Cleaned up ${result.deletedCount} inactive Docker sessions`);
    } catch (error) {
      logger.error('Failed to clean up inactive Docker sessions', error);
      throw new InternalServerError('Failed to clean up inactive Docker sessions');
    }
  }
}

export const dockerSessionService = new DockerSessionService();