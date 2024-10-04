import { dockerService } from './docker.service';
import DockerSession, { IDockerSessionDocument } from '../models/docker-session.model';
import DemoProjectCredentials from '../models/demo-credentials.model';
import { CustomError, NotFoundError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import jwt from 'jsonwebtoken';
import environment from '../config/environment';

class ProjectDemoService {
  async startSession(projectName: string, username: string): Promise<{ 
    session: IDockerSessionDocument, 
    token: string, 
    port: string, 
    demoCookieValue: string, 
    credentials: { username: string, password: string } 
  }> {
    try {
      const credentials = await DemoProjectCredentials.findOne({ projectName, username });
      if (!credentials) {
        throw new NotFoundError('Demo credentials not found');
      }

      const containerId = await dockerService.createContainer(projectName, Date.now().toString());
      const session = new DockerSession({
        projectName,
        containerId,
        activeUsers: [{ username, role: credentials.role }],
        startTime: new Date(),
      });
      await session.save();

      const token = this.generateToken(session._id.toString(), username, credentials.role);
      const port = await dockerService.getContainerPort(session.containerId);

      logger.info(`Started session for project ${projectName} with user ${username}`);
      const demoCookieValue = this.generateDemoCookieValue(username, credentials.role);

      return { 
        session, 
        token, 
        port,
        demoCookieValue,
        credentials: { username: credentials.username, password: credentials.password }
      };
    } catch (error) {
      logger.error('Error starting session:', error);
      throw new CustomError('Failed to start session', 500);
    }
  }

  async switchUser(sessionId: string, newUsername: string): Promise<{ token: string, credentials: { username: string, password: string } }> {
    try {
      const session = await DockerSession.findById(sessionId);
      if (!session) {
        throw new NotFoundError('Session not found');
      }

      const credentials = await DemoProjectCredentials.findOne({ projectName: session.projectName, username: newUsername });
      if (!credentials) {
        throw new NotFoundError('Demo credentials not found');
      }

      const existingUserIndex = session.activeUsers.findIndex(user => user.username === newUsername);
      if (existingUserIndex === -1) {
        session.activeUsers.push({ username: newUsername, role: credentials.role });
      } else {
        session.activeUsers[existingUserIndex].role = credentials.role;
      }
      await session.save();

      const token = this.generateToken(sessionId, newUsername, credentials.role);

      logger.info(`Switched to user ${newUsername} in session ${sessionId}`);
      return { 
        token, 
        credentials: { username: credentials.username, password: credentials.password }
      };
    } catch (error) {
      logger.error(`Error switching user in session ${sessionId}:`, error);
      throw error;
    }
  }

  async getSessionStatus(sessionId: string): Promise<IDockerSessionDocument> {
    try {
      const session = await DockerSession.findById(sessionId);
      if (!session) {
        throw new NotFoundError('Session not found');
      }
      return session;
    } catch (error) {
      logger.error(`Error getting session status for ${sessionId}:`, error);
      throw error;
    }
  }

  async endSession(sessionId: string): Promise<void> {
    try {
      const session = await DockerSession.findById(sessionId);
      if (!session) {
        throw new NotFoundError('Session not found');
      }

      await dockerService.stopContainer(session.containerId);
      session.endTime = new Date();
      await session.save();

      logger.info(`Ended session ${sessionId}`);
    } catch (error) {
      logger.error(`Error ending session ${sessionId}:`, error);
      throw error;
    }
  }

  private generateToken(sessionId: string, username: string, role: string): string {
    return jwt.sign(
      { sessionId, username, role },
      environment.auth.jwtSecret,
      { expiresIn: '1h' }
    );
  }

  private generateDemoCookieValue(username: string, role: string): string {
    return jwt.sign(
      { username, role },
      environment.auth.demoProjectSecret,
      { expiresIn: '1h' }
    );
  }

}

export const projectDemoService = new ProjectDemoService();