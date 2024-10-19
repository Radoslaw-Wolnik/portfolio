// src/services/network.service.ts
import Docker from 'dockerode';
import logger from '../utils/logger.util';
import { BadRequestError } from '../utils/custom-errors.util';

class NetworkService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async createProjectNetwork(projectName: string): Promise<void> {
    try {
      await this.docker.createNetwork({
        Name: `${projectName}_network`,
        Driver: 'bridge',
      });
      logger.info(`Created network for project: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to create network for project: ${projectName}`, error);
      throw new BadRequestError('Failed to create project network');
    }
  }

  async removeProjectNetwork(projectName: string): Promise<void> {
    try {
      const network = this.docker.getNetwork(`${projectName}_network`);
      await network.remove();
      logger.info(`Removed network for project: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to remove network for project: ${projectName}`, error);
      throw new BadRequestError('Failed to remove project network');
    }
  }

  async connectContainerToNetwork(containerName: string, networkName: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerName);
      const network = this.docker.getNetwork(networkName);
      await network.connect({ Container: container.id });
      logger.info(`Connected container ${containerName} to network ${networkName}`);
    } catch (error) {
      logger.error(`Failed to connect container ${containerName} to network ${networkName}`, error);
      throw new BadRequestError('Failed to connect container to network');
    }
  }
}

export const networkService = new NetworkService();