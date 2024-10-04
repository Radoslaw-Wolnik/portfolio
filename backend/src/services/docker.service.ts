import Docker from 'dockerode';
import logger from '../utils/logger.util';
import environment from '../config/environment';
import { getWebSocketService, ContainerStatus } from './websocket.service';


class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: environment.docker.socketPath });
  }

  async createContainer(projectName: string, sessionId: string): Promise<string> {
    const webSocketService = getWebSocketService();
    try {
      webSocketService.emitContainerStatus(sessionId, { 
        status: ContainerStatus.CREATING, 
        message: 'Creating container' 
      });

      const container = await this.docker.createContainer({
        Image: `portfolio-demo-${projectName}:latest`,
        name: `portfolio-demo-${projectName}-${sessionId}`,
        Env: [
          `AUTH_SECRET=${environment.auth.demoProjectSecret}`,
        ],
        HostConfig: {
          AutoRemove: true,
          PortBindings: {
            '3000/tcp': [{ HostPort: '0' }] // Dynamically assign a port
          },
          ExtraHosts: ['host.docker.internal:host-gateway'], // This allows the container to access the host machine
        },
      });

      webSocketService.emitContainerStatus(sessionId, { 
        status: ContainerStatus.STARTING, 
        message: 'Starting container' 
      });

      await container.start();
      const containerInfo = await container.inspect();
      const port = containerInfo.NetworkSettings.Ports['3000/tcp'][0].HostPort;

      webSocketService.emitContainerStatus(sessionId, { 
        status: ContainerStatus.RUNNING, 
        message: 'Container running',
        containerId: container.id
      });

      logger.info(`Container created and started: ${container.id}, Port: ${port}`);
      return container.id;
    } catch (error) {
      webSocketService.emitContainerStatus(sessionId, { 
        status: ContainerStatus.ERROR, 
        message: 'Error creating container',
        error: (error as Error).message
      });
      logger.error('Error creating container:', error);
      throw error;
    }
  }

  async stopContainer(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.stop();
      logger.info(`Container stopped: ${containerId}`);
    } catch (error) {
      logger.error(`Error stopping container ${containerId}:`, error);
      throw error;
    }
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

  async createBaseImage(projectName: string): Promise<void> {
    try {
      const stream = await this.docker.buildImage({
        context: `./docker-compose/${projectName}`,
        src: ['Dockerfile'],
      }, { t: `portfolio-demo-${projectName}:latest` });

      await new Promise((resolve, reject) => {
        this.docker.modem.followProgress(stream, (err: Error | null, res: any[] | null) => err ? reject(err) : resolve(res));
      });

      logger.info(`Base image created for project: ${projectName}`);
    } catch (error) {
      logger.error(`Error creating base image for project ${projectName}:`, error);
      throw error;
    }
  }
}

export const dockerService = new DockerService();