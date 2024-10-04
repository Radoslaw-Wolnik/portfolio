import { dockerService } from '../services/docker.service';
import logger from '../utils/logger.util';

export const cleanupContainers = async () => {
  try {
    const cleanedContainers = await dockerService.cleanupInactiveContainers();
    logger.info(`Cleaned up ${cleanedContainers.length} inactive containers`);
  } catch (error) {
    logger.error('Error cleaning up containers:', error);
  }
};