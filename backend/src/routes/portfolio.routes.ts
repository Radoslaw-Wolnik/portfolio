import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import * as portfolioController from '../controllers/portfolio.controller';

const router = express.Router();

router.get('/projects', portfolioController.getPortfolioProjects);
router.get('/projects/:projectName/route', portfolioController.getProjectRoute);

router.use(authenticateJWT);
router.use(isAdmin);

router.post('/projects', portfolioController.createPortfolioProject);
router.post('/projects/:projectId/deploy', portfolioController.deployProject);
router.post('/projects/:projectId/stop', portfolioController.stopProject);
router.post('/projects/:projectId/freeze', portfolioController.freezeProject);
router.post('/projects/:projectId/unfreeze', portfolioController.unfreezeProject);
router.post('/sessions', portfolioController.createDemoSession);
router.get('/stats', portfolioController.getPortfolioStats);

export default router;