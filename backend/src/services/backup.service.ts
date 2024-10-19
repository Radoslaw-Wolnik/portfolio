import { promisify } from 'util';
import { exec } from 'child_process';
import { projectService } from './project.service';
import { NotFoundError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

const execAsync = promisify(exec);

export class BackupService {
  async backupProject(projectId: string): Promise<any> {
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const backupPath = `/backups/${project.name}_${Date.now()}.tar.gz`;
    
    try {
      const { stdout, stderr } = await execAsync(`docker-compose -f ${project.dockerComposeFile} -p ${project.name} exec -T db mongodump --archive --gzip > ${backupPath}`);
      logger.info(`Project backup created: ${project.name}`, { stdout, stderr });
      return { message: 'Backup created successfully', backupPath };
    } catch (error) {
      logger.error(`Failed to create backup for project: ${project.name}`, error);
      throw new InternalServerError('Failed to create project backup');
    }
  }

  async restoreProject(projectId: string, backupPath: string): Promise<any> {
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    try {
      const { stdout, stderr } = await execAsync(`docker-compose -f ${project.dockerComposeFile} -p ${project.name} exec -T db mongorestore --archive --gzip < ${backupPath}`);
      logger.info(`Project restored from backup: ${project.name}`, { stdout, stderr });
      return { message: 'Project restored successfully' };
    } catch (error) {
      logger.error(`Failed to restore project from backup: ${project.name}`, error);
      throw new InternalServerError('Failed to restore project from backup');
    }
  }
}

export const backupService = new BackupService();