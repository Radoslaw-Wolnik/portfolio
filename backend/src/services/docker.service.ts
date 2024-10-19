import Docker from 'dockerode';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import logger from '../utils/logger.util';
import { BadRequestError, InternalServerError, NotFoundError } from '../utils/custom-errors.util';
import environment from '../config/environment';

const execAsync = promisify(exec);

class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async pullRepository(gitUrl: string, branch: string, projectName: string): Promise<void> {
    const projectPath = path.join('/tmp', projectName);
    try {
      await execAsync(`git clone -b ${branch} ${gitUrl} ${projectPath}`);
      logger.info(`Repository cloned: ${gitUrl}`);
    } catch (error) {
      logger.error(`Failed to clone repository: ${gitUrl}`, error);
      throw new BadRequestError('Failed to clone repository');
    }
  }

  async buildImage(projectName: string, dockerfilePath: string): Promise<void> {
    try {
      const stream = await this.docker.buildImage({
        context: path.dirname(dockerfilePath),
        src: [path.basename(dockerfilePath)],
      }, { t: `${projectName}:latest` });

      await new Promise((resolve, reject) => {
        this.docker.modem.followProgress(stream, (err: Error | null, res: any[] | null) => err ? reject(err) : resolve(res));
      });

      logger.info(`Image built: ${projectName}:latest`);
    } catch (error) {
      logger.error(`Failed to build image: ${projectName}`, error);
      throw new InternalServerError('Failed to build Docker image');
    }
  }

  async startContainer(projectName: string, dockerComposeFile: string): Promise<void> {
    const composePath = path.join('/tmp', projectName, dockerComposeFile);
    try {
      if (!await fs.access(composePath).then(() => true).catch(() => false)) {
        throw new NotFoundError('Docker Compose file not found');
      }

      await execAsync(`docker-compose -f ${composePath} up -d`);
      logger.info(`Container started: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to start container: ${projectName}`, error);
      throw new InternalServerError('Failed to start container');
    }
  }

  async stopContainer(projectName: string): Promise<void> {
    try {
      const container = await this.docker.getContainer(projectName);
      await container.stop();
      logger.info(`Container stopped: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to stop container: ${projectName}`, error);
      throw new InternalServerError('Failed to stop container');
    }
  }

  async removeImage(projectName: string): Promise<void> {
    try {
      const image = this.docker.getImage(`${projectName}:latest`);
      await image.remove();
      logger.info(`Image removed: ${projectName}:latest`);
    } catch (error) {
      logger.error(`Failed to remove image: ${projectName}`, error);
      throw new InternalServerError('Failed to remove Docker image');
    }
  }

  async getContainerLogs(projectName: string): Promise<string> {
    try {
      const container = await this.docker.getContainer(projectName);
      const logs = await container.logs({ stdout: true, stderr: true });
      return logs.toString();
    } catch (error) {
      logger.error(`Failed to get container logs: ${projectName}`, error);
      throw new InternalServerError('Failed to retrieve container logs');
    }
  }

  async getContainerStatus(projectName: string): Promise<string> {
    try {
      const container = await this.docker.getContainer(projectName);
      const info = await container.inspect();
      return info.State.Status;
    } catch (error) {
      logger.error(`Failed to get container status: ${projectName}`, error);
      throw new InternalServerError('Failed to retrieve container status');
    }
  }

  async freezeContainer(projectName: string): Promise<void> {
    try {
      const container = await this.docker.getContainer(projectName);
      await container.pause();
      logger.info(`Container frozen: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to freeze container: ${projectName}`, error);
      throw new InternalServerError('Failed to freeze container');
    }
  }

  async thawContainer(projectName: string): Promise<void> {
    try {
      const container = await this.docker.getContainer(projectName);
      await container.unpause();
      logger.info(`Container thawed: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to thaw container: ${projectName}`, error);
      throw new InternalServerError('Failed to thaw container');
    }
  }

  async duplicateImage(sourceImageName: string, newImageName: string): Promise<void> {
    try {
      const sourceImage = await this.docker.getImage(`${sourceImageName}:latest`);
      await sourceImage.tag({ repo: newImageName, tag: 'latest' });
      logger.info(`Image duplicated: ${sourceImageName} -> ${newImageName}`);
    } catch (error) {
      logger.error(`Failed to duplicate image: ${sourceImageName}`, error);
      throw new InternalServerError('Failed to duplicate Docker image');
    }
  }

  async createUserSession(projectName: string, username: string): Promise<string> {
    try {
      const container = await this.docker.getContainer(projectName);
      const exec = await container.exec({
        Cmd: ['su', '-', username],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true
      });

      const stream = await exec.start({ hijack: true, stdin: true });
      const sessionId = exec.id;

      logger.info(`User session created: ${sessionId}`, { projectName, username });
      return sessionId;
    } catch (error) {
      logger.error(`Failed to create user session: ${projectName}`, error);
      throw new InternalServerError('Failed to create user session');
    }
  }

  async switchUser(sessionId: string, newUsername: string): Promise<{ token: string, credentials: { username: string, password: string } }> {
    try {
      // This is a placeholder implementation. In a real-world scenario, you'd need to:
      // 1. Terminate the current user session
      // 2. Start a new session for the new user
      // 3. Generate and return new credentials

      // For demonstration purposes, we'll use a mock implementation
      const mockToken = `mock_token_${newUsername}_${Date.now()}`;
      const mockCredentials = {
        username: newUsername,
        password: `temp_password_${Date.now()}`  // In reality, you'd generate a secure password
      };

      logger.info(`User switched in session: ${sessionId}`, { newUsername });
      return { token: mockToken, credentials: mockCredentials };
    } catch (error) {
      logger.error(`Failed to switch user in session: ${sessionId}`, error);
      throw new InternalServerError('Failed to switch user');
    }
  }

  async cleanupInactiveContainers(): Promise<string[]> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const inactiveContainers = containers.filter(
        (container) => container.State === 'exited' && container.Names[0].startsWith('/project-')
      );

      const removedContainers: string[] = [];
      for (const container of inactiveContainers) {
        await this.docker.getContainer(container.Id).remove();
        removedContainers.push(container.Id);
      }

      logger.info(`Cleaned up ${removedContainers.length} inactive containers`);
      return removedContainers;
    } catch (error) {
      logger.error('Failed to clean up inactive containers:', error);
      throw new InternalServerError('Failed to clean up inactive containers');
    }
  }

  async getContainerPort(containerId: string): Promise<string> {
    try {
      const container = this.docker.getContainer(containerId);
      const containerInfo = await container.inspect();
      const port = containerInfo.NetworkSettings.Ports['3000/tcp'][0].HostPort;
      return port;
    } catch (error) {
      logger.error(`Failed to get container port for ${containerId}:`, error);
      throw new InternalServerError('Failed to retrieve container port');
    }
  }

  async terminateUserSession(containerSessionId: string): Promise<void> {
    try {
      const container = await this.docker.getExec(containerSessionId);
      await container.resize({ h: 1, w: 1 }); // Minimize the terminal
      await container.stop();
      logger.info(`User session terminated: ${containerSessionId}`);
    } catch (error) {
      logger.error(`Failed to terminate user session: ${containerSessionId}`, error);
      throw new InternalServerError('Failed to terminate user session');
    }
  }
}

export const dockerService = new DockerService();