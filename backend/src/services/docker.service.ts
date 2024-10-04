// docker.service.ts
import Docker from 'dockerode';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { getWebSocketService } from './websocket.service';

const docker = new Docker();

export class DockerService {
  async createBaseImage(projectName: string): Promise<string> {
    const composeFile = await fs.readFile(`./docker-compose/${projectName}.yml`, 'utf8');
    const composeConfig = yaml.load(composeFile) as any;

    const baseImageName = `portfolio-demo-base-${projectName}:latest`;

    await docker.buildImage({
      context: composeConfig.services.app.build.context,
      src: ['Dockerfile', ...composeConfig.services.app.build.dockerfile]
    }, { t: baseImageName });

    return baseImageName;
  }

  async ensureBaseImageExists(projectName: string): Promise<string> {
    const baseImageName = `portfolio-demo-base-${projectName}:latest`;
    try {
      await docker.getImage(baseImageName).inspect();
      return baseImageName;
    } catch (error) {
      return this.createBaseImage(projectName);
    }
  }

  async createContainer(projectName: string, sessionId: string): Promise<string> {
    const webSocketService = getWebSocketService();
    
    try {
      webSocketService.sendUpdate(sessionId, 'Ensuring base image exists');
      const baseImageName = await this.ensureBaseImageExists(projectName);

      webSocketService.sendUpdate(sessionId, 'Creating container from base image');
      const container = await docker.createContainer({
        Image: baseImageName,
        name: `portfolio-demo-${projectName}-${sessionId}`,
        Env: [/* Add any necessary environment variables */],
        HostConfig: {
          AutoRemove: true, // Automatically remove the container when it's stopped
        }
      });

      webSocketService.sendUpdate(sessionId, 'Starting container');
      await container.start();

      webSocketService.sendUpdate(sessionId, 'Container ready');
      return container.id;
    } catch (error) {
      webSocketService.sendUpdate(sessionId, `Error: ${(error as Error).message}`);
      throw error;
    }
  }

  async stopContainer(containerId: string): Promise<void> {
    const container = docker.getContainer(containerId);
    await container.stop();
    // No need to remove the container as it's set to auto-remove
  }
}

export const dockerService = new DockerService();