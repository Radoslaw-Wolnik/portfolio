import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';
import logger from '../utils/logger.util';
import { BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import environment from '../config/environment';

export enum ContainerStatus {
  CREATING = 'creating',
  STARTING = 'starting',
  RUNNING = 'running',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  ERROR = 'error'
}

interface StatusUpdate {
  status: ContainerStatus;
  message: string;
  containerId?: string;
  error?: string;
}

const execAsync = promisify(exec);

interface TraefikRule {
  [key: string]: {
    rule: string;
    service: string;
  };
}

class RoutingService {
  private traefikConfigPath: string;

  constructor() {
    this.traefikConfigPath = environment.traefik.configPath;
  }

  async addProjectRoute(projectName: string, subdomain: string): Promise<void> {
    try {
      const config = await this.getTraefikConfig();
      
      config.http.routers[projectName] = {
        rule: `Host(\`${subdomain}.${environment.app.domain}\`)`,
        service: projectName,
      };

      await this.saveTraefikConfig(config);
      await this.reloadTraefik();
      logger.info(`Added route for project: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to add route for project: ${projectName}`, error);
      throw new InternalServerError('Failed to add project route');
    }
  }

  async removeProjectRoute(projectName: string): Promise<void> {
    try {
      const config = await this.getTraefikConfig();
      
      delete config.http.routers[projectName];

      await this.saveTraefikConfig(config);
      await this.reloadTraefik();
      logger.info(`Removed route for project: ${projectName}`);
    } catch (error) {
      logger.error(`Failed to remove route for project: ${projectName}`, error);
      throw new InternalServerError('Failed to remove project route');
    }
  }

  private async getTraefikConfig(): Promise<any> {
    try {
      const fileContents = await fs.readFile(this.traefikConfigPath, 'utf8');
      return yaml.load(fileContents);
    } catch (error) {
      logger.error('Failed to read Traefik config', error);
      throw new BadRequestError('Failed to read Traefik configuration');
    }
  }

  private async saveTraefikConfig(config: any): Promise<void> {
    try {
      const yamlStr = yaml.dump(config);
      await fs.writeFile(this.traefikConfigPath, yamlStr, 'utf8');
    } catch (error) {
      logger.error('Failed to save Traefik config', error);
      throw new BadRequestError('Failed to save Traefik configuration');
    }
  }

  private async reloadTraefik(): Promise<void> {
    try {
      await execAsync('docker kill -s HUP traefik');
      logger.info('Traefik configuration reloaded');
    } catch (error) {
      logger.error('Failed to reload Traefik', error);
      throw new BadRequestError('Failed to reload Traefik');
    }
  }
}

export const routingService = new RoutingService();