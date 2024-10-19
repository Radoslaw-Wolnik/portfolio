// src/services/routing.service.ts
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';
import logger from '../utils/logger.util';
import { BadRequestError } from '../utils/custom-errors.util';

const execAsync = promisify(exec);

interface TraefikRule {
  [key: string]: {
    rule: string;
    service: string;
    tls?: { certresolver: string };
  };
}

class RoutingService {
  private traefikConfigPath: string;

  constructor() {
    this.traefikConfigPath = process.env.TRAEFIK_CONFIG_PATH || '/etc/traefik/dynamic_conf/routing.yml';
  }

  async addProjectRoute(projectName: string, subdomain: string, httpsEnabled: boolean): Promise<void> {
    const config = await this.getTraefikConfig();
    
    config.http.routers[projectName] = {
      rule: `Host(\`${subdomain}.${process.env.DOMAIN_NAME}\`)`,
      service: projectName,
    };

    if (httpsEnabled) {
      config.http.routers[projectName].tls = { certresolver: 'myresolver' };
    }

    await this.saveTraefikConfig(config);
    await this.reloadTraefik();
    logger.info(`Added route for project: ${projectName}`);
  }

  async removeProjectRoute(projectName: string): Promise<void> {
    const config = await this.getTraefikConfig();
    
    delete config.http.routers[projectName];

    await this.saveTraefikConfig(config);
    await this.reloadTraefik();
    logger.info(`Removed route for project: ${projectName}`);
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
