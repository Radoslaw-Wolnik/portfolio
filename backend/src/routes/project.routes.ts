import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import {createProject, updateProject, deployProject, stopProject, deleteProject, getProjectHealth, getProjectResources, backupProject, restoreProject, getAllProjects, getProjectById } from '../controllers/project.controller';

const router = express.Router();


router.use(authenticateJWT);

router.post('/projects', authenticateJWT, createProject);
router.put('/projects/:projectId', authenticateJWT, updateProject);
router.post('/projects/:projectId/deploy', authenticateJWT, deployProject);
router.post('/projects/:projectId/stop', authenticateJWT, stopProject);
router.delete('/projects/:projectId', authenticateJWT, deleteProject);
router.get('/projects/:projectId/health', authenticateJWT, getProjectHealth);
router.get('/projects/:projectId/resources', authenticateJWT, getProjectResources);
router.post('/projects/:projectId/backup', authenticateJWT, backupProject);
router.post('/projects/:projectId/restore', authenticateJWT, restoreProject);
router.get('/projects', authenticateJWT, getAllProjects);
router.get('/projects/:projectId', authenticateJWT, getProjectById);

export default router;