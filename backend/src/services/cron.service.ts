import cron from 'node-cron';
import { cleanupContainers } from '../jobs/cleanup-containers.job';
import { prebuildImages } from '../jobs/prebuild-images.job';
import logger from '../utils/logger.util';

class CronService {
  initializeJobs() {
    // Run container cleanup every day at midnight
    cron.schedule('0 0 * * *', async () => {
      logger.info('Running container cleanup job');
      await cleanupContainers();
    });

    // Run image prebuilding every week on Sunday at 2 AM
    cron.schedule('0 2 * * 0', async () => {
      logger.info('Running image prebuild job');
      await prebuildImages();
    });
  }

  async runJob(jobName: string) {
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
  }
}

export const cronService = new CronService();