// src/routes/project-page.routes.ts
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { uploadProjectImages } from '../middleware/upload.middleware';
import { createProjectPage, getProjectPage, updateProjectPage } from '../controllers/project-page.controller';

const router = express.Router();

router.post('/project-pages', authenticateJWT, isAdmin, uploadProjectImages, createProjectPage);
router.get('/project-pages/:projectId', getProjectPage);
router.put('/project-pages/:projectId', authenticateJWT, isAdmin, uploadProjectImages, updateProjectPage);

export default router;