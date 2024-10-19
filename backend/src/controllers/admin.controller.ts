import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/global';
import { projectService } from '../services/project.service';
import { dockerSessionService } from '../services/docker-session.service';
import { monitoringService } from '../services/monitoring.service';
import { InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';


export const getDashboardStats = async(req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectStats = await projectService.getProjectStats();
    const sessionStats = await dockerSessionService.getSessionStats();
    //const systemMetrics = await monitoringService.getSystemMetrics();

    res.json({
      projects: projectStats,
      sessions: sessionStats,
      // system: systemMetrics,
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats', error);
    next(new InternalServerError('Error fetching dashboard stats'));
  }
}

/*
export const getSystemLogs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate, level } = req.query;
    const logs = await monitoringService.getLogs(startDate as string, endDate as string, level as string);
    res.json(logs);
  } catch (error) {
    logger.error('Error fetching system logs', error);
    next(new InternalServerError('Error fetching system logs'));
  }
}
*/