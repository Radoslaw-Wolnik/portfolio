import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/global';
import DemoUser, { IDemoUser } from '../models/demo-user.model';
import Project from '../models/project.model';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import bcrypt from 'bcrypt';


export const createDemoUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password, projectId, role } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const existingUser = await DemoUser.findOne({ username, project: projectId });
    if (existingUser) {
      throw new BadRequestError('Demo user already exists for this project');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const demoUser = new DemoUser({
      username,
      password: hashedPassword,
      project: projectId,
      role
    });

    await demoUser.save();
    logger.info(`Demo user created: ${demoUser.username} for project ${project.name}`, { createdBy: req.user!._id });
    
    const demoUserResponse = demoUser.toJSON();
    res.status(201).json(demoUserResponse);
  } catch (error) {
    next(error);
  }
}

export const updateDemoUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const demoUser = await DemoUser.findById(id);
    if (!demoUser) {
      throw new NotFoundError('Demo user not found');
    }

    if (username) demoUser.username = username;
    if (role) demoUser.role = role;
    if (password) {
      demoUser.password = await bcrypt.hash(password, 10);
    }

    await demoUser.save();
    logger.info(`Demo user updated: ${demoUser.username}`, { updatedBy: req.user!._id });

    const updatedDemoUserResponse = demoUser.toJSON();
    res.json(updatedDemoUserResponse);
  } catch (error) {
    next(error);
  }
}

export const deleteDemoUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const demoUser = await DemoUser.findByIdAndDelete(id);
    if (!demoUser) {
      throw new NotFoundError('Demo user not found');
    }
    logger.info(`Demo user deleted: ${demoUser.username}`, { deletedBy: req.user!._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const getDemoUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const demoUsers = await DemoUser.find({ project: projectId }).select('-password');
    res.json(demoUsers);
  } catch (error) {
    next(error);
  }
}
