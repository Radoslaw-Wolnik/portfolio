// session.controller.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dockerService } from '../services/docker.service';
import { DockerSession } from '../models/docker-session.model';

export class SessionController {
  async startSession(req: Request, res: Response) {
    const { projectName } = req.body;
    const sessionId = uuidv4();

    try {
      const containerId = await dockerService.createContainer(projectName, sessionId);
      
      const session = new DockerSession({
        sessionId,
        projectName,
        containerId,
        status: 'ready',
        startTime: new Date()
      });
      await session.save();

      res.json({ sessionId });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // ... rest of the controller methods
}

export const sessionController = new SessionController();