import { Request, Response, NextFunction } from 'express';
import { checkDBHealth } from '../utils/db-connection.util';
import logger from '../utils/logger.util'; 
import { InternalServerError, ServiceUnavailableError } from '../utils/custom-errors.util';
import { checkOverallHealth, verifyEmailService } from '../utils/health.util';


export const getBasicHealth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    next(new InternalServerError('Error in basic health check'));
  }
}

export const getDetailedHealth = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: 'Unknown',
    emailService: 'Unknown',
  };

  try {
    // Check database connection state
    healthcheck.database = checkDBHealth();

    // Check email service
    try {
      await verifyEmailService();
      healthcheck.emailService = 'OK';
    } catch (error) {
      healthcheck.emailService = 'Error';
      healthcheck.message = 'Partial outage';
    }

    // Overall health check
    const overallHealth = await checkOverallHealth();
    if (!overallHealth) {
      healthcheck.message = 'Service degraded';
    }

    const statusCode = healthcheck.message === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthcheck);
  } catch (error) {
    logger.error('Detailed health check failed', { error: (error as Error).message });
    next(new ServiceUnavailableError('Health check failed'));
  }
}
