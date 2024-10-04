import { dockerService } from '../services/docker.service';
import Project from '../models/project.model';
import logger from '../utils/logger.util';

export const prebuildImages = async () => {
  try {
    const projects = await Project.find();
    for (const project of projects) {
      await dockerService.createBaseImage(project.name);
    }
    logger.info('Prebuilt images for all projects');
  } catch (error) {
    logger.error('Error prebuilding images:', error);
  }
};