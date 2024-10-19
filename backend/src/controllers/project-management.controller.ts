// src/controllers/project-management.controller.ts
import { Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

const execAsync = promisify(exec);

export const deployProject = async (req: Request, res: Response) => {
  const { projectName, gitUrl, branch = 'main' } = req.body;

  if (!projectName || !gitUrl) {
    throw new BadRequestError('Project name and Git URL are required');
  }

  try {
    const { stdout, stderr } = await execAsync(`./scripts/deploy_project.sh ${projectName} ${gitUrl} ${branch}`);
    logger.info(`Project ${projectName} deployed: ${stdout}`);
    if (stderr) {
      logger.warn(`Deployment warnings: ${stderr}`);
    }
    res.json({ message: 'Project deployed successfully', logs: stdout });
  } catch (error) {
    logger.error(`Error deploying project ${projectName}:`, error);
    throw new InternalServerError('Failed to deploy project');
  }
};

export const stopProject = async (req: Request, res: Response) => {
  const { projectName } = req.params;

  try {
    const { stdout, stderr } = await execAsync(`./scripts/stop_project.sh ${projectName}`);
    logger.info(`Project ${projectName} stopped: ${stdout}`);
    if (stderr) {
      logger.warn(`Stop warnings: ${stderr}`);
    }
    res.json({ message: 'Project stopped successfully', logs: stdout });
  } catch (error) {
    logger.error(`Error stopping project ${projectName}:`, error);
    throw new InternalServerError('Failed to stop project');
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { projectName } = req.params;
  const { branch = 'main' } = req.body;

  try {
    const { stdout, stderr } = await execAsync(`./scripts/update_project.sh ${projectName} ${branch}`);
    logger.info(`Project ${projectName} updated: ${stdout}`);
    if (stderr) {
      logger.warn(`Update warnings: ${stderr}`);
    }
    res.json({ message: 'Project updated successfully', logs: stdout });
  } catch (error) {
    logger.error(`Error updating project ${projectName}:`, error);
    throw new InternalServerError('Failed to update project');
  }
};