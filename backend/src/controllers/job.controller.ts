import { Request, Response } from 'express';
import { cronService } from '../services/cron.service';
import logger from '../utils/logger.util';

export const runJob = async (req: Request, res: Response) => {
  const { jobName } = req.params;

  try {
    logger.info(`Starting manual job: ${jobName}`);
    await cronService.runJob(jobName);
    res.status(200).json({ message: `Job ${jobName} completed successfully` });
  } catch (error) {
    logger.error(`Error running job ${jobName}:`, error);
    res.status(500).json({ message: `Error running job ${jobName}`, error: (error as Error).message });
  }
};

// Enhanced getJobStatus to check the status of any job dynamically
export const getJobStatus = (req: Request, res: Response) => {
  const { jobName } = req.params;

  try {
    // Fetch job status from the cron service for the given jobName
    const status = cronService.getJobStatus(jobName);
    res.status(200).json({ jobName, status });
  } catch (error) {
    logger.error(`Error checking job status for ${jobName}:`, error);
    res.status(404).json({ message: `Error checking status for job ${jobName}: ${(error as Error).message}` });
  }
};
