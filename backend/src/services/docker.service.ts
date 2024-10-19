// src/services/docker.service.ts
import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import logger from '../utils/logger.util';
import { BadRequestError } from '../utils/custom-errors.util';

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
    const stream = await this.docker.buildImage({
      context: path.dirname(dockerfilePath),
      src: [path.basename(dockerfilePath)],
    }, { t: `${projectName}:latest` });

    await new Promise((resolve, reject) => {
      this.docker.modem.followProgress(stream, (err: Error | null, res: any[] | null) => err ? reject(err) : resolve(res));
    });

    logger.info(`Image built: ${projectName}:latest`);
  }

  async startContainer(projectName: string, dockerComposeFile: string): Promise<void> {
    const composePath = path.join('/tmp', projectName, dockerComposeFile);
    if (!fs.existsSync(composePath)) {
      throw new BadRequestError('Docker Compose file not found');
    }

    try {
      await execAsync(`docker-compose -f ${composePath} up -d`);
      logger.info(`Container started: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to start container: ${projectName}`, error);
      throw new BadRequestError('Failed to start container');
    }
  }

  async stopContainer(projectName: string): Promise<void> {
    const container = await this.docker.getContainer(projectName);
    await container.stop();
    logger.info(`Container stopped: ${projectName}`);
  }

  async getContainerLogs(projectName: string): Promise<string> {
    const container = await this.docker.getContainer(projectName);
    const logs = await container.logs({ stdout: true, stderr: true });
    return logs.toString();
  }

  async getContainerStatus(projectName: string): Promise<string> {
    const container = await this.docker.getContainer(projectName);
    const info = await container.inspect();
    return info.State.Status;
  }

  async getContainerPort(containerId: string): Promise<string> {
    try {
      const container = this.docker.getContainer(containerId);
      const containerInfo = await container.inspect();
      return containerInfo.NetworkSettings.Ports['3000/tcp'][0].HostPort;
    } catch (error) {
      logger.error(`Error getting container port for ${containerId}:`, error);
      throw error;
    }
  }


  // check these two functions 
  async cleanupInactiveContainers(): Promise<string[]> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const inactiveContainers = containers.filter(
        (container) => container.State === 'exited' && container.Names[0].startsWith('/portfolio-demo-')
      );

      const removedContainers: string[] = [];
      for (const container of inactiveContainers) {
        await this.docker.getContainer(container.Id).remove();
        removedContainers.push(container.Id);
      }

      logger.info(`Cleaned up ${removedContainers.length} inactive containers`);
      return removedContainers;
    } catch (error) {
      logger.error('Error cleaning up inactive containers:', error);
      throw error;
    }
  }
}

export const dockerService = new DockerService();