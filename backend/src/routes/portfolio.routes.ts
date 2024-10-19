import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import * as portfolioController from '../controllers/portfolio.controller';

const router = express.Router();

// Public routes
router.get('/projects', portfolioController.getPortfolioProjects);
router.get('/projects/:projectName/route', portfolioController.getProjectRoute);

// Protected routes
router.use(authenticateJWT);
router.use(isAdmin);

router.post('/projects/:projectName/start', portfolioController.startPortfolioProject);
router.post('/projects/:projectName/stop', portfolioController.stopPortfolioProject);
router.get('/projects/:projectName/logs', portfolioController.getPortfolioProjectLogs);
router.post('/sessions', portfolioController.createUserSession);
router.delete('/sessions/:sessionId', portfolioController.terminateUserSession);

export default router;