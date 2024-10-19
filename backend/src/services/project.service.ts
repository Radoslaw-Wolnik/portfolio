
// src/services/project.service.ts
import Project, { IProject } from '../models/project.model';
import { dockerService } from './docker.service';
import { routingService } from './routing.service';
import { NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

class ProjectService {
  async createProject(projectData: Partial<IProject>): Promise<IProject> {
    const project = new Project(projectData);
    await project.save();
    

    await dockerService.pullRepository(project.gitUrl, project.branch, project.name);
    await dockerService.buildImage(project.name, project.dockerComposeFile);
    
    if (project.status === 'running') {
      await this.startProject(project.id);
    }

    logger.info(`Project created: ${project.name}`);
    return project;
  }

  async updateProject(id: string, updateData: Partial<IProject>): Promise<IProject> {
    const project = await Project.findByIdAndUpdate(id, updateData, { new: true });
    if (!project) {
      throw new NotFoundError('Project not found');
    }


    if (updateData.status === 'running' && project.status !== 'running') {
      await this.startProject(project.id);
    } else if (updateData.status === 'stopped' && project.status !== 'stopped') {
      await this.stopProject(project.id);
    }

    logger.info(`Project updated: ${project.name}`);
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status === 'running') {
      await this.stopProject(id);
    }

    await dockerService.removeImage(project.name);
    await Project.findByIdAndDelete(id);
    logger.info(`Project deleted: ${project.name}`);
  }

  async startProject(id: string): Promise<IProject> {
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status === 'running') {
      throw new BadRequestError('Project is already running');
    }

    await dockerService.startContainer(project.name, project.dockerComposeFile);
    await routingService.addProjectRoute(project.name, project.subdomain, project.httpsEnabled);
    
    project.status = 'running';
    await project.save();
    
    logger.info(`Project started: ${project.name}`);
    return project;
  }

  async stopProject(id: string): Promise<IProject> {
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status !== 'running') {
      throw new BadRequestError('Project is not running');
    }

    await dockerService.stopContainer(project.name);
    await routingService.removeProjectRoute(project.name);
    
    project.status = 'stopped';
    await project.save();
    
    logger.info(`Project stopped: ${project.name}`);
    return project;
  }

}

export const projectService = new ProjectService();