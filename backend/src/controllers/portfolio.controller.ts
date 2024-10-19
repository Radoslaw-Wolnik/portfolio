import { Response, NextFunction } from 'express';
import Project from '../models/project.model';
import { dockerService } from '../services/docker.service';
import { NotFoundError, InternalServerError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import { v4 as uuidv4 } from 'uuid';

interface UserSession {
  id: string;
  projectName: string;
  username: string;
  containerSessionId: string;
}

const userSessions: UserSession[] = [];

export const getPortfolioProjects = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await Project.find({ isPortfolioProject: true });
    res.json(projects);
  } catch (error) {
    next(new InternalServerError('Error fetching portfolio projects'));
  }
};

export const getProjectRoute = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName } = req.params;
    const project = await Project.findOne({ name: projectName, isPortfolioProject: true });
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    res.json({ route: `${project.subdomain}.${req.get('host')}` });
  } catch (error) {
    next(error);
  }
};

export const startPortfolioProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName } = req.params;
    const project = await Project.findOne({ name: projectName, isPortfolioProject: true });
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status === 'running') {
      throw new BadRequestError('Project is already running');
    }

    await dockerService.startContainer(project.name, project.dockerComposeFile);
    
    project.status = 'running';
    await project.save();
    
    logger.info(`Portfolio project started: ${project.name}`, { userId: req.user._id });
    res.json({ message: 'Project started successfully', project });
  } catch (error) {
    next(error);
  }
};

export const stopPortfolioProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName } = req.params;
    const project = await Project.findOne({ name: projectName, isPortfolioProject: true });
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.status !== 'running') {
      throw new BadRequestError('Project is not running');
    }

    await dockerService.stopContainer(project.name);
    
    project.status = 'stopped';
    await project.save();
    
    logger.info(`Portfolio project stopped: ${project.name}`, { userId: req.user._id });
    res.json({ message: 'Project stopped successfully', project });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioProjectLogs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName } = req.params;
    const project = await Project.findOne({ name: projectName, isPortfolioProject: true });
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const logs = await dockerService.getContainerLogs(project.name);
    res.json({ logs });
  } catch (error) {
    next(error);
  }
};

export const createUserSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName, username } = req.body;
    const project = await Project.findOne({ name: projectName, isPortfolioProject: true });
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const containerSessionId = await dockerService.createUserSession(project.name, username);
    const sessionId = uuidv4();
    
    userSessions.push({
      id: sessionId,
      projectName,
      username,
      containerSessionId
    });

    logger.info(`User session created: ${sessionId}`, { projectName, username, userId: req.user._id });
    res.json({ sessionId, message: `Logged in as ${username} in project ${projectName}` });
  } catch (error) {
    next(error);
  }
};

export const terminateUserSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const sessionIndex = userSessions.findIndex(session => session.id === sessionId);
    
    if (sessionIndex === -1) {
      throw new NotFoundError('Session not found');
    }

    const session = userSessions[sessionIndex];
    await dockerService.terminateUserSession(session.containerSessionId);
    
    userSessions.splice(sessionIndex, 1);

    logger.info(`User session terminated: ${sessionId}`, { userId: req.user._id });
    res.json({ message: 'Session terminated successfully' });
  } catch (error) {
    next(error);
  }
};