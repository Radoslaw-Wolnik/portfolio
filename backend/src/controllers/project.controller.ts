import { Response, NextFunction } from 'express';
import Project, { IProject } from '../models/project.model';
import { dockerService } from '../services/docker.service';
import { routingService } from '../services/routing.service';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import { getWebSocketService } from '../services/websocket.service';

import { Response, NextFunction } from 'express';
import Project, { IProject } from '../models/project.model';
import { dockerService } from '../services/docker.service';
import { routingService } from '../services/routing.service';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const getAllProjects = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    next(new InternalServerError('Error fetching projects'));
  }
};

export const getProjectById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectData: Partial<IProject> = req.body;
    const project = new Project(projectData);
    await project.save();

    await dockerService.pullRepository(project.gitUrl, project.branch, project.name);
    await dockerService.buildImage(project.name, project.dockerComposeFile);
    
    if (project.status === 'running') {
      await startProject(project.id);
    }

    logger.info(`Project created: ${project.name}`, { userId: req.user._id });
    res.status(201).json(project);
  } catch (error) {
    next(new InternalServerError('Error creating project'));
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (req.body.status === 'running' && project.status !== 'running') {
      await startProject(project.id);
    } else if (req.body.status === 'stopped' && project.status !== 'stopped') {
      await stopProject(project.id);
    }

    logger.info(`Project updated: ${project.name}`, { userId: req.user._id });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status === 'running') {
      await stopProject(project.id);
    }

    await dockerService.removeImage(project.name);
    await Project.findByIdAndDelete(project.id);
    logger.info(`Project deleted: ${project.name}`, { userId: req.user._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const startProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status === 'running') {
      throw new BadRequestError('Project is already running');
    }

    await dockerService.startContainer(project.name, project.dockerComposeFile);
    await routingService.addProjectRoute(project.name, project.subdomain);
    
    project.status = 'running';
    await project.save();
    
    logger.info(`Project started: ${project.name}`, { userId: req.user._id });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const stopProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
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
    
    logger.info(`Project stopped: ${project.name}`, { userId: req.user._id });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const thawProject = async (project: IProject): Promise<void> => {
  try {
    await dockerService.thawContainer(project.name);
    logger.info(`Project thawed: ${project.name}`);
  } catch (error) {
    logger.error(`Error thawing project: ${project.name}`, error);
    throw new InternalServerError('Error thawing project');
  }
};

export const freezeProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status === 'frozen') {
      throw new BadRequestError('Project is already frozen');
    }

    if (project.status === 'running') {
      await stopProject(req, res, next);
    }

    await dockerService.freezeContainer(project.name);
    project.status = 'frozen';
    await project.save();

    logger.info(`Project frozen: ${project.name}`, { userId: req.user._id });
    res.json(project);
  } catch (error) {
    next(error instanceof Error ? error : new InternalServerError('Error freezing project'));
  }
};

export const duplicateProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sourceProject = await Project.findById(req.params.id);
    if (!sourceProject) {
      throw new NotFoundError('Source project not found');
    }

    const newProjectData = {
      ...sourceProject.toObject(),
      _id: undefined,
      name: `${sourceProject.name}-copy`,
      subdomain: `${sourceProject.subdomain}-copy`,
      status: 'stopped'
    };

    const newProject = new Project(newProjectData);
    await newProject.save();

    await dockerService.duplicateImage(sourceProject.name, newProject.name);

    logger.info(`Project duplicated: ${newProject.name}`, { userId: req.user._id, sourceProjectId: sourceProject._id });
    res.status(201).json(newProject);
  } catch (error) {
    next(error instanceof Error ? error : new InternalServerError('Error duplicating project'));
  }
};

export const loginAsUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const { username } = req.body;
    const sessionId = await dockerService.createUserSession(project.name, username);

    logger.info(`Logged in as user in project: ${project.name}`, { userId: req.user._id, username });
    res.json({ sessionId, message: `Logged in as ${username} in project ${project.name}` });
  } catch (error) {
    next(error instanceof Error ? error : new InternalServerError('Error logging in as user'));
  }
};

export const switchUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId, newUsername } = req.body;
    const result = await dockerService.switchUser(sessionId, newUsername);

    logger.info(`Switched user in session: ${sessionId}`, { userId: req.user._id, newUsername });
    res.json(result);
  } catch (error) {
    next(error instanceof Error ? error : new InternalServerError('Error switching user'));
  }
};