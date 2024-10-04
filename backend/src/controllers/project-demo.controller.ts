// project-demo.controller.ts
import { Request, Response, NextFunction } from 'express';
import { startOrGetProjectContainer, stopProjectContainer, getContainerLogs } from '../services/docker.service';
import Project from '../models/project.model';
import DemoUser from '../models/demo-user.model';
import DockerSession from '../models/dockersession.model';
import { NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const startOrJoinProjectDemo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectName, role } = req.body;
    const project = await Project.findOne({ name: projectName });
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    if (!project.availableRoles.includes(role)) {
      throw new BadRequestError('Invalid role for this project');
    }

    const demoUser = await DemoUser.findOne({ projectId: project._id, role });
    if (!demoUser) {
      throw new NotFoundError('Demo user not found');
    }

    const containerId = await startOrGetProjectContainer(projectName);
    
    let session = await DockerSession.findOne({ containerId, endTime: { $exists: false } });
    
    if (session) {
      // Check if this role is already active
      const existingUser = session.activeUsers.find(user => user.role === role);
      if (existingUser) {
        throw new BadRequestError('This role is already active in the session');
      }
      
      // Add the new user to the existing session
      session.activeUsers.push({ userId: demoUser._id, role });
    } else {
      // Create a new session
      session = new DockerSession({
        projectName,
        containerId,
        activeUsers: [{ userId: demoUser._id, role }],
        ipAddress: req.ip,
        startTime: new Date(),
      });
    }
    
    await session.save();

    res.json({ 
      message: 'Joined project demo',
      sessionId: session._id,
      loginUrl: `http://${projectName}-demo.localhost`,
      username: demoUser.username,
      password: demoUser.password
    });
  } catch (error) {
    next(error);
  }
};

// project-demo.controller.ts
export const loginToProjectDemo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, username, password } = req.body;
      const session = await DockerSession.findById(sessionId).populate('activeUsers.userId');
      if (!session) {
        throw new NotFoundError('Session not found');
      }
  
      const user = session.activeUsers.find(u => u.userId.username === username);
      if (!user || user.userId.password !== password) {
        throw new UnauthorizedError('Invalid credentials');
      }
  
      res.json({
        success: true,
        username: user.userId.username,
        role: user.role
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const logoutFromProjectDemo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, username } = req.body;
      const session = await DockerSession.findById(sessionId);
      if (!session) {
        throw new NotFoundError('Session not found');
      }
  
      session.activeUsers = session.activeUsers.filter(u => u.userId.username !== username);
      await session.save();
  
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

export const getProjectDemoStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const session = await DockerSession.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    const logs = await getContainerLogs(session.containerId);
    res.json({ logs });
  } catch (error) {
    next(error);
  }
};

export const stopProjectDemo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const session = await DockerSession.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    await stopProjectContainer(session.containerId);
    
    session.endTime = new Date();
    session.duration = (session.endTime.getTime() - session.startTime.getTime()) / 1000;
    await session.save();

    res.json({ message: 'Project demo stopped' });
  } catch (error) {
    next(error);
  }
};