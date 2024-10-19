import Docker from 'dockerode';
import logger from '../utils/logger.util';
import { InternalServerError } from '../utils/custom-errors.util';
import environment from '../config/environment';

class NetworkService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: environment.docker.socketPath });
  }

  async createNetwork(networkName: string): Promise<void> {
    try {
      await this.docker.createNetwork({
        Name: networkName,
        Driver: 'bridge',
      });
      logger.info(`Network created: ${networkName}`);
    } catch (error) {
      logger.error(`Failed to create network: ${networkName}`, error);
      throw new InternalServerError('Failed to create network');
    }
  }

  async removeNetwork(networkName: string): Promise<void> {
    try {
      const network = this.docker.getNetwork(networkName);
      await network.remove();
      logger.info(`Network removed: ${networkName}`);
    } catch (error) {
      logger.error(`Failed to remove network: ${networkName}`, error);
      throw new InternalServerError('Failed to remove network');
    }
  }

  async connectContainerToNetwork(containerName: string, networkName: string): Promise<void> {
    try {
      const network = this.docker.getNetwork(networkName);
      await network.connect({ Container: containerName });
      logger.info(`Container ${containerName} connected to network ${networkName}`);
    } catch (error) {
      logger.error(`Failed to connect container ${containerName} to network ${networkName}`, error);
      throw new InternalServerError('Failed to connect container to network');
    }
  }

  async disconnectContainerFromNetwork(containerName: string, networkName: string): Promise<void> {
    try {
      const network = this.docker.getNetwork(networkName);
      await network.disconnect({ Container: containerName });
      logger.info(`Container ${containerName} disconnected from network ${networkName}`);
    } catch (error) {
      logger.error(`Failed to disconnect container ${containerName} from network ${networkName}`, error);
      throw new InternalServerError('Failed to disconnect container from network');
    }
  }
}

export const networkService = new NetworkService();