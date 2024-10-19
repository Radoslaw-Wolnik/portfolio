import cron from 'node-cron';
import { cleanupContainers } from '../jobs/cleanup-containers.job';
import { prebuildImages } from '../jobs/prebuild-images.job';
import logger from '../utils/logger.util';

class CronService {
  // Store statuses dynamically based on jobs
  private jobStatuses: Record<string, string> = {
    cleanupContainers: 'idle',
    prebuildImages: 'idle',
  };

  initializeJobs() {
    cron.schedule('0 0 * * *', async () => {
      logger.info('Running container cleanup job');
      this.updateJobStatus('cleanupContainers', 'running');
      await cleanupContainers();
      this.updateJobStatus('cleanupContainers', 'idle');
    });

    cron.schedule('0 2 * * 0', async () => {
      logger.info('Running image prebuild job');
      this.updateJobStatus('prebuildImages', 'running');
      await prebuildImages();
      this.updateJobStatus('prebuildImages', 'idle');
    });
  }

  async runJob(jobName: string) {
    if (!this.jobStatuses[jobName]) {
      throw new Error(`Job ${jobName} does not exist`);
    }
    if (this.jobStatuses[jobName] === 'running') {
      throw new Error(`Job ${jobName} is already running`);
    }

    this.updateJobStatus(jobName, 'running');
    try {
      switch (jobName) {
        case 'cleanupContainers':
          await cleanupContainers();
          break;
        case 'prebuildImages':
          await prebuildImages();
          break;
        default:
          throw new Error(`Unknown job: ${jobName}`);
      }
    } finally {
      this.updateJobStatus(jobName, 'idle');
    }
  }

  // Helper to update the status of a job
  private updateJobStatus(jobName: string, status: string) {
    this.jobStatuses[jobName] = status;
  }

  // Get the status of a specific job
  getJobStatus(jobName: string): string {
    if (!this.jobStatuses[jobName]) {
      throw new Error(`Job ${jobName} does not exist`);
    }
    return this.jobStatuses[jobName];
  }
  
  // Optional: Get all job statuses (could be useful if needed)
  getAllJobStatuses(): Record<string, string> {
    return this.jobStatuses;
  }
}

export const cronService = new CronService();
