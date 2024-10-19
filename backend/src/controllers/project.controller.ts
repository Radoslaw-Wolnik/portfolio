import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/global';
import { projectService } from '../services/project.service';
import { NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await projectService.createProject(req.body);
    logger.info(`Project created: ${project.name}`, { userId: req.user!._id });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    logger.info(`Project updated: ${project.name}`, { userId: req.user!._id });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await projectService.deleteProject(req.params.id);
    logger.info(`Project deleted: ${req.params.id}`, { userId: req.user!._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const deployProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await projectService.deployProject(req.params.id);
    logger.info(`Project deployed: ${req.params.id}`, { userId: req.user!._id });
    res.json({ message: 'Project deployed successfully' });
  } catch (error) {
    next(error);
  }
};

export const stopProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await projectService.stopProject(req.params.id);
    logger.info(`Project stopped: ${req.params.id}`, { userId: req.user!._id });
    res.json({ message: 'Project stopped successfully' });
  } catch (error) {
    next(error);
  }
};

export const freezeProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await projectService.freezeProject(req.params.id);
    logger.info(`Project frozen: ${req.params.id}`, { userId: req.user!._id });
    res.json({ message: 'Project frozen successfully' });
  } catch (error) {
    next(error);
  }
};

export const unfreezeProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await projectService.unfreezeProject(req.params.id);
    logger.info(`Project unfrozen: ${req.params.id}`, { userId: req.user!._id });
    res.json({ message: 'Project unfrozen successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProjectStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await projectService.getProjectStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

/*

export const getProjectHealth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.params;
    const health = await monitoringService.getProjectHealth(projectId);
    res.json(health);
  } catch (error) {
    next(error);
  }
}

export const getProjectResources = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.params;
    const resources = await monitoringService.getProjectResources(projectId);
    res.json(resources);
  } catch (error) {
    next(error);
  }
}

export const backupProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.params;
    const backupResult = await backupService.backupProject(projectId);
    res.json(backupResult);
  } catch (error) {
    next(error);
  }
}

export const restoreProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { backupPath } = req.body;
    const restoreResult = await backupService.restoreProject(projectId, backupPath);
    res.json(restoreResult);
  } catch (error) {
    next(error);
  }
}

*/