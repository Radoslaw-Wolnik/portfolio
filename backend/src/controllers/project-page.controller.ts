// src/controllers/project-page.controller.ts
import { Response, NextFunction } from 'express';
import ProjectPage, { IProjectPage } from '../models/project-page.model';
import { NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const createProjectPage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId, title, description } = req.body;
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

    const projectPage = new ProjectPage({
      projectId,
      title,
      description,
      images,
    });

    await projectPage.save();
    logger.info(`Project page created for project: ${projectId}`, { userId: req.user!._id });
    res.status(201).json(projectPage);
  } catch (error) {
    next(error);
  }
};

export const getProjectPage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectPage = await ProjectPage.findOne({ projectId: req.params.projectId });
    if (!projectPage) {
      throw new NotFoundError('Project page not found');
    }
    res.json(projectPage);
  } catch (error) {
    next(error);
  }
};

export const updateProjectPage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description } = req.body;
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : undefined;

    const projectPage = await ProjectPage.findOneAndUpdate(
      { projectId: req.params.projectId },
      { title, description, ...(images && { images }) },
      { new: true, runValidators: true }
    );

    if (!projectPage) {
      throw new NotFoundError('Project page not found');
    }

    logger.info(`Project page updated for project: ${req.params.projectId}`, { userId: req.user!._id });
    res.json(projectPage);
  } catch (error) {
    next(error);
  }
};