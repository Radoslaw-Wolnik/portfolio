import { dockerService } from './docker.service';
import { projectService } from './project.service';
import { NotFoundError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export class MonitoringService {
  async getProjectHealth(projectId: string): Promise<any> {
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const healthStatus = await Promise.all(project.containers.map(async (container) => {
      try {
        const stats = await dockerService.getContainerStats(container.name);
        return { 
          container: container.name, 
          status: stats.State.Status,
          health: stats.State.Health?.Status || 'N/A'
        };
      } catch (error) {
        logger.error(`Failed to get health for container: ${container.name}`, error);
        return { container: container.name, status: 'Error', health: 'Unknown' };
      }
    }));

    return { projectName: project.name, containers: healthStatus };
  }

  async getProjectResources(projectId: string): Promise<any> {
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const resourceUsage = await Promise.all(project.containers.map(async (container) => {
      try {
        const stats = await dockerService.getContainerStats(container.name);
        return {
          container: container.name,
          cpu: stats.CPUStats.CPUUsage.TotalUsage,
          memory: stats.MemoryStats.Usage,
          network: {
            rx_bytes: stats.Networks.eth0.RxBytes,
            tx_bytes: stats.Networks.eth0.TxBytes
          }
        };
      } catch (error) {
        logger.error(`Failed to get resources for container: ${container.name}`, error);
        return { container: container.name, status: 'Error', resources: 'Unknown' };
      }
    }));

    return { projectName: project.name, containers: resourceUsage };
  }
}

export const monitoringService = new MonitoringService();