// src/routes/project-management.routes.ts
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { deployProject, stopProject, updateProject } from '../controllers/project-management.controller';

const router = express.Router();

router.use(authenticateJWT, isAdmin);

router.post('/deploy', deployProject);
router.post('/:projectName/stop', stopProject);
router.post('/:projectName/update', updateProject);

export default router;