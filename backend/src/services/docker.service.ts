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

  async createExec(containerName: string, command: string[]): Promise<string> {
    try {
      const container = this.docker.getContainer(containerName);
      const exec = await container.exec({
        Cmd: command,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true
      });
      const stream = await exec.start({});
      return exec.id;
    } catch (error) {
      logger.error(`Failed to create exec in container: ${containerName}`, error);
      throw new InternalServerError('Failed to create exec in container');
    }
  }

  async startProject(projectName: string, dockerComposeFile: string): Promise<void> {
    try {
      await execAsync(`docker-compose -f ${dockerComposeFile} -p ${projectName} up -d`);
      logger.info(`Project started: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to start project: ${projectName}`, error);
      throw new InternalServerError('Failed to start project');
    }
  }
  
  async stopProject(projectName: string, dockerComposeFile: string): Promise<void> {
    try {
      await execAsync(`docker-compose -f ${dockerComposeFile} -p ${projectName} down`);
      logger.info(`Project stopped: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to stop project: ${projectName}`, error);
      throw new InternalServerError('Failed to stop project');
    }
  }

  async startContainer(projectName: string, dockerComposeFile: string): Promise<void> {
    try {
      await execAsync(`docker-compose -f ${dockerComposeFile} -p ${projectName} up -d`);
      logger.info(`Container started: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to start container: ${projectName}`, error);
      throw new InternalServerError('Failed to start container');
    }
  }

  async stopContainer(projectName: string, dockerComposeFile: string): Promise<void> {
    try {
      await execAsync(`docker-compose -f ${dockerComposeFile} -p ${projectName} down`);
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

  async freezeContainer(containerName: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerName);
      await container.pause();
      logger.info(`Container frozen: ${containerName}`);
    } catch (error) {
      logger.error(`Failed to freeze container: ${containerName}`, error);
      throw new InternalServerError('Failed to freeze container');
    }
  }

  async unfreezeContainer(containerName: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerName);
      await container.unpause();
      logger.info(`Container unfrozen: ${containerName}`);
    } catch (error) {
      logger.error(`Failed to unfreeze container: ${containerName}`, error);
      throw new InternalServerError('Failed to unfreeze container');
    }
  }

  async cleanupInactiveContainers(): Promise<string[]> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const inactiveContainers = containers.filter(container => container.State !== 'running');
      
      const removedContainers: string[] = [];
      for (const container of inactiveContainers) {
        await this.docker.getContainer(container.Id).remove();
        removedContainers.push(container.Id);
        logger.info(`Removed inactive container: ${container.Id}`);
      }

      return removedContainers;
    } catch (error) {
      logger.error('Failed to cleanup inactive containers', error);
      throw new InternalServerError('Failed to cleanup inactive containers');
    }
  }
}

export const dockerService = new DockerService();