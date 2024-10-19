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
    this.docker = new Docker({ socketPath: environment.docker.socketPath });
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

  async switchUser(containerSessionId: string, newUsername: string): Promise<void> {
    try {
      // Get the container instance from the containerSessionId
      const container = await this.docker.getContainer(containerSessionId);
  
      // Create an exec instance with the 'su' command to switch user
      const exec = await container.exec({
        Cmd: ['su', '-', newUsername],  // Define the command here
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true
      });
  
      // Start the exec command to switch user
      await exec.start({
        hijack: true, // Enables the stream connection for input/output
        stdin: true
      });
  
      logger.info(`Switched user to ${newUsername} in container session: ${containerSessionId}`);
    } catch (error) {
      logger.error(`Failed to switch user in container session: ${containerSessionId}`, error);
      throw new InternalServerError('Failed to switch user in container session');
    }
  }
  

  async terminateUserSession(containerSessionId: string): Promise<void> {
    try {
      // Get the exec instance by its ID
      const exec = await this.docker.getExec(containerSessionId);
  
      // Option 1: Simulate stopping the session (resize or close it gracefully)
      await exec.resize({ h: 1, w: 1 });  // Minimizing terminal size, an indirect way to stop
  
      logger.info(`User session terminated: ${containerSessionId}`);
    } catch (error) {
      logger.error(`Failed to terminate user session: ${containerSessionId}`, error);
      throw new InternalServerError('Failed to terminate user session');
    }
  }
  

  async deployProject(projectName: string, dockerComposeFile: string): Promise<void> {
    try {
      const { stdout, stderr } = await execAsync(`docker-compose -f ${dockerComposeFile} -p ${projectName} up -d`);
      logger.info(`Project deployed: ${projectName}`, { stdout, stderr });
    } catch (error) {
      logger.error(`Failed to deploy project: ${projectName}`, error);
      throw new InternalServerError('Failed to deploy project');
    }
  }

  async stopProject(projectName: string, dockerComposeFile: string): Promise<void> {
    try {
      const { stdout, stderr } = await execAsync(`docker-compose -f ${dockerComposeFile} -p ${projectName} down`);
      logger.info(`Project stopped: ${projectName}`, { stdout, stderr });
    } catch (error) {
      logger.error(`Failed to stop project: ${projectName}`, error);
      throw new InternalServerError('Failed to stop project');
    }
  }

  async getContainerLogs(containerId: string): Promise<string> {
    try {
      const container = this.docker.getContainer(containerId);
      const logs = await container.logs({ stdout: true, stderr: true });
      return logs.toString();
    } catch (error) {
      logger.error(`Failed to get container logs: ${containerId}`, error);
      throw new InternalServerError('Failed to get container logs');
    }
  }

  async getContainerStats(containerId: string): Promise<any> {
    try {
      const container = this.docker.getContainer(containerId);
      const stats = await container.stats({ stream: false });
      return stats;
    } catch (error) {
      logger.error(`Failed to get container stats: ${containerId}`, error);
      throw new InternalServerError('Failed to get container stats');
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

  async unfreezeContainer(projectName: string): Promise<void> {
    try {
      const container = await this.docker.getContainer(projectName);
      await container.unpause();
      logger.info(`Container unfrozen: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to unfreeze container: ${projectName}`, error);
      throw new InternalServerError('Failed to unfreeze container');
    }
  }

  // Freeze all containers for a project
  async freezeProject(projectName: string): Promise<{name: string }> {
    try {
      const containers = await this.docker.listContainers({
        all: true, // List all containers, including stopped ones
        filters: { name: [projectName] } // Filter containers by project name
      });

      if (containers.length === 0) {
        throw new NotFoundError(`No containers found for project: ${projectName}`);
      }

      for (const containerInfo of containers) {
        const container = this.docker.getContainer(containerInfo.Id);
        await container.pause();
        logger.info(`Container frozen: ${containerInfo.Names[0]}`);
      }

      logger.info(`All containers frozen for project: ${projectName}`);
      return {name: projectName }
    } catch (error) {
      logger.error(`Failed to freeze project containers: ${projectName}`, error);
      throw new InternalServerError('Failed to freeze project containers');
    }
  }

  // Unfreeze all containers for a project
  async unfreezeProject(projectName: string): Promise<{name: string }> {
    try {
      const containers = await this.docker.listContainers({
        all: true,
        filters: { name: [projectName] }
      });

      if (containers.length === 0) {
        throw new NotFoundError(`No containers found for project: ${projectName}`);
      }

      for (const containerInfo of containers) {
        const container = this.docker.getContainer(containerInfo.Id);
        await container.unpause();
        logger.info(`Container unfrozen: ${containerInfo.Names[0]}`);
      }

      logger.info(`All containers unfrozen for project: ${projectName}`);
      return {name: projectName }
    } catch (error) {
      logger.error(`Failed to unfreeze project containers: ${projectName}`, error);
      throw new InternalServerError('Failed to unfreeze project containers');
    }
  }
}

export const dockerService = new DockerService();