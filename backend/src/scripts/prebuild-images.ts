// scripts/prebuild-images.ts
import { dockerService } from '../services/docker.service';
import fs from 'fs/promises';
import path from 'path';

async function prebuildImages() {
  const projectsDir = path.join(__dirname, '..', 'docker-compose');
  const files = await fs.readdir(projectsDir);

  for (const file of files) {
    if (file.endsWith('.yml')) {
      const projectName = path.basename(file, '.yml');
      console.log(`Prebuilding image for ${projectName}...`);
      await dockerService.createBaseImage(projectName);
      console.log(`Finished prebuilding image for ${projectName}`);
    }
  }
}

prebuildImages().catch(console.error);