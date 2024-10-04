// cleanup.service.ts
import Docker from 'dockerode';

const docker = new Docker();

export class CleanupService {
  async cleanupContainers() {
    const containers = await docker.listContainers({ all: true });
    
    for (const container of containers) {
      if (container.Names[0].startsWith('/portfolio-demo-') && !container.Names[0].includes('-base-')) {
        const containerInstance = docker.getContainer(container.Id);
        await containerInstance.stop();
        await containerInstance.remove();
      }
    }
  }
}

export const cleanupService = new CleanupService();