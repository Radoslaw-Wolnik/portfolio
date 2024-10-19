// src/controllers/demo-user.controller.ts
import { Request, Response } from 'express';
import DemoUser, { IDemoUser } from '../models/demo-user.model';
import Project from '../models/project.model';
import { NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import bcrypt from 'bcrypt';

export const createDemoUser = async (req: Request, res: Response) => {
  const userData = req.body;
  const project = await Project.findById(userData.project);
  if (!project) {
    throw new NotFoundError('Project not found');
  }

  const existingUser = await DemoUser.findOne({ username: userData.username, project: userData.project });
  if (existingUser) {
    throw new BadRequestError('User already exists for this project');
  }

  const hashedPassword = await bcrypt.hash(userData.password!, 10);
  const demoUser = new DemoUser({ ...userData, password: hashedPassword });
  await demoUser.save();
  logger.info(`Demo user created: ${demoUser.username} for project ${project.name}`);
  res.status(201).json(demoUser);
};

export const getDemoUsers = async (req: Request, res: Response) => {
  // check if passed req.params.projectId
  const demoUsers = DemoUser.find({ project: req.params.projectId }).select('-password');
  res.json(demoUsers);
};

export const updateDemoUser = async (req: Request, res: Response) => {
  const updateData = req.body;
  const id = req.params.id;

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  const demoUser = await DemoUser.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  if (!demoUser) {
    throw new NotFoundError('Demo user not found');
  }
  logger.info(`Demo user updated: ${demoUser.username}`);

  res.json(demoUser);
};

export const deleteDemoUser = async (req: Request, res: Response) => {

  const demoUser = await DemoUser.findByIdAndDelete(req.params.id);
  if (!demoUser) {
    throw new NotFoundError('Demo user not found');
  }
  logger.info(`Demo user deleted: ${demoUser.username}`);

  res.status(204).send();
};

/*
// propably here
async switchUser(sessionId: string, newUsername: string): Promise<{ token: string, credentials: { username: string, password: string } }> {
  try {
    const session = await DockerSession.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    const credentials = await DemoProjectCredentials.findOne({ projectName: session.projectName, username: newUsername });
    if (!credentials) {
      throw new NotFoundError('Demo credentials not found');
    }

    const existingUserIndex = session.activeUsers.findIndex(user => user.username === newUsername);
    if (existingUserIndex === -1) {
      session.activeUsers.push({ username: newUsername, role: credentials.role });
    } else {
      session.activeUsers[existingUserIndex].role = credentials.role;
    }
    await session.save();

    const token = this.generateToken(sessionId, newUsername, credentials.role);

    logger.info(`Switched to user ${newUsername} in session ${sessionId}`);
    return { 
      token, 
      credentials: { username: credentials.username, password: credentials.password }
    };
  } catch (error) {
    logger.error(`Error switching user in session ${sessionId}:`, error);
    throw error;
  }
}

private generateToken(sessionId: string, username: string, role: string): string {
  return jwt.sign(
    { sessionId, username, role },
    environment.auth.jwtSecret,
    { expiresIn: '1h' }
  );
}

private generateDemoCookieValue(username: string, role: string): string {
  return jwt.sign(
    { username, role },
    environment.auth.demoProjectSecret,
    { expiresIn: '1h' }
  );

*/