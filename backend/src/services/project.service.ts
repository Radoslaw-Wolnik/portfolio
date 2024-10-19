import Project, { IProject } from '../models/project.model';
import { NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

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
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    logger.info(`Project deleted: ${project.name}`);
  }

  async getAllProjects(): Promise<IProject[]> {
    return Project.find();
  }

  async getProjectStats(): Promise<any> {
    const totalProjects = await Project.countDocuments();
    const runningProjects = await Project.countDocuments({ status: 'running' });
    const stoppedProjects = await Project.countDocuments({ status: 'stopped' });

    return { totalProjects, runningProjects, stoppedProjects };
  }
}

export const projectService = new ProjectService();