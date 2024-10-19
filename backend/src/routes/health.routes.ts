import express from 'express';
import { getBasicHealth, getDetailedHealth } from '../controllers/health.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';

const router = express.Router();

router.get('/health', getBasicHealth);
router.get('/health/detailed', authenticateJWT, isAdmin, getDetailedHealth);

export default router;

/* To check eg in docker-container
* healthcheck:
*      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
*      interval: 30s
*      timeout: 10s
*      retries: 3
*      start_period: 40s 
*/