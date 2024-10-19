// src/routes/project.routes.ts
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import * as projectController from '../controllers/project.controller';

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/default', projectController.getDefaultProject);
router.get('/:id', projectController.getProjectById);

router.use(authenticateJWT, isAdmin);

router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/start', projectController.startProject);
router.post('/:id/stop', projectController.stopProject);

export default router;