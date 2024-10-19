import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/global';
import { projectService } from '../services/project.service';
import { dockerService } from '../services/docker.service';
import { routingService } from '../services/routing.service';
import { monitoringService } from '../services/monitoring.service';
import { backupService } from '../services/backup.service';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export class PortfolioController {
  async createProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.createProject(req.body);
      logger.info(`Project created: ${project.name}`, { userId: req.user!._id });
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const updatedProject = await projectService.updateProject(projectId, req.body);
      logger.info(`Project updated: ${updatedProject.name}`, { userId: req.user!._id });
      res.json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

  async deployProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const project = await projectService.getProjectById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      await dockerService.deployProject(project.name, project.dockerComposeFile);
      
      for (const container of project.containers) {
        if (container.type === 'frontend' || container.type === 'backend') {
          await routingService.addProjectRoute(
            `${project.name}-${container.name}`,
            project.subdomain,
            container.type === 'backend' ? '/api' : '/'
          );
        }
      }

      project.status = 'running';
      await project.save();

      logger.info(`Project deployed: ${project.name}`, { userId: req.user!._id });
      res.json({ message: 'Project deployed successfully', project });
    } catch (error) {
      next(error);
    }
  }

  async stopProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const project = await projectService.getProjectById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      await dockerService.stopProject(project.name, project.dockerComposeFile);
      
      for (const container of project.containers) {
        if (container.type === 'frontend' || container.type === 'backend') {
          await routingService.removeProjectRoute(`${project.name}-${container.name}`);
        }
      }

      project.status = 'stopped';
      await project.save();

      logger.info(`Project stopped: ${project.name}`, { userId: req.user!._id });
      res.json({ message: 'Project stopped successfully', project });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const project = await projectService.getProjectById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      if (project.status === 'running') {
        await dockerService.stopProject(project.name, project.dockerComposeFile);
      }

      for (const container of project.containers) {
        if (container.type === 'frontend' || container.type === 'backend') {
          await routingService.removeProjectRoute(`${project.name}-${container.name}`);
        }
      }

      await projectService.deleteProject(projectId);

      logger.info(`Project deleted: ${project.name}`, { userId: req.user!._id });
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getProjectHealth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const health = await monitoringService.getProjectHealth(projectId);
      res.json(health);
    } catch (error) {
      next(error);
    }
  }

  async getProjectResources(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const resources = await monitoringService.getProjectResources(projectId);
      res.json(resources);
    } catch (error) {
      next(error);
    }
  }

  async backupProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const backupResult = await backupService.backupProject(projectId);
      res.json(backupResult);
    } catch (error) {
      next(error);
    }
  }

  async restoreProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const { backupPath } = req.body;
      const restoreResult = await backupService.restoreProject(projectId, backupPath);
      res.json(restoreResult);
    } catch (error) {
      next(error);
    }
  }
}

export const portfolioController = new PortfolioController();