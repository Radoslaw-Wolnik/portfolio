import Project, { IProject, IContainer } from '../models/project.model';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import { dockerService } from './docker.service';
import { networkService } from './network.service';

export class ProjectService {
  async createProject(projectData: Partial<IProject>): Promise<IProject> {
    const project = new Project(projectData);
    await project.save();
    logger.info(`Project created: ${project.name}`);
    return project;
  }

  async getProjectById(projectId: string): Promise<IProject | null> {
    return Project.findById(projectId);
  }

  async updateProject(projectId: string, projectData: Partial<IProject>): Promise<IProject> {
    const project = await Project.findByIdAndUpdate(projectId, projectData, { new: true, runValidators: true });
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    logger.info(`Project updated: ${project.name}`);
    return project;
  }

  async deleteProject(projectId: string): Promise<void> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Stop and remove all containers
    for (const container of project.containers) {
      await dockerService.stopContainer(container.name, project.dockerComposeFile);
      // await dockerService.removeContainer(container.name, project.dockerComposeFile);
    }

    // Remove the project network
    await networkService.removeNetwork(`${project.name}_network`);

    // Remove the project from the database
    await Project.findByIdAndDelete(projectId);
    logger.info(`Project deleted: ${project.name}`);
  }

  async getAllProjects(): Promise<IProject[]> {
    return Project.find();
  }

  async deployProject(projectId: string): Promise<void> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
  
    await networkService.createNetwork(`${project.name}_network`);
    await dockerService.startProject(project.name, project.dockerComposeFile);
  
    project.status = 'running';
    await project.save();
    logger.info(`Project deployed: ${project.name}`);
  }

  async startProject(projectId: string): Promise<void> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
  
    // Start the project using docker service
    await dockerService.startProject(project.name, project.dockerComposeFile);
  
    project.status = 'running';
    await project.save();
    logger.info(`Project started: ${project.name}`);
  }
  
  async stopProject(projectId: string): Promise<void> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
  
    await dockerService.stopProject(project.name, project.dockerComposeFile);
  
    project.status = 'stopped';
    await project.save();
    logger.info(`Project stopped: ${project.name}`);
  }

  async freezeProject(projectId: string): Promise<void> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    try {
      for (const container of project.containers) {
        await dockerService.freezeContainer(container.name);
      }

      project.status = 'frozen';
      await project.save();
      logger.info(`Project frozen: ${project.name}`);
    } catch (error) {
      logger.error(`Failed to freeze project: ${project.name}`, error);
      throw new InternalServerError('Failed to freeze project');
    }
  }

  async unfreezeProject(projectId: string): Promise<void> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    try {
      for (const container of project.containers) {
        await dockerService.unfreezeContainer(container.name);
      }

      project.status = 'running';
      await project.save();
      logger.info(`Project unfrozen: ${project.name}`);
    } catch (error) {
      logger.error(`Failed to unfreeze project: ${project.name}`, error);
      throw new InternalServerError('Failed to unfreeze project');
    }
  }

  async getProjectStats(): Promise<any> {
    const totalProjects = await Project.countDocuments();
    const runningProjects = await Project.countDocuments({ status: 'running' });
    const stoppedProjects = await Project.countDocuments({ status: 'stopped' });
    const frozenProjects = await Project.countDocuments({ status: 'frozen' });

    return { totalProjects, runningProjects, stoppedProjects, frozenProjects };
  }
}

export const projectService = new ProjectService();