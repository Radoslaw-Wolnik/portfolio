import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import * as projectController from '../controllers/project.controller';

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

router.use(authenticateJWT, isAdmin);

router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/start', projectController.startProject);
router.post('/:id/stop', projectController.stopProject);
router.post('/:id/freeze', projectController.freezeProject);
router.post('/:id/duplicate', projectController.duplicateProject);
router.post('/:projectId/login-as-user', projectController.loginAsUser);
router.post('/switch-user', projectController.switchUser);

export default router;