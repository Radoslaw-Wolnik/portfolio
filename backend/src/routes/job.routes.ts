import express from 'express';
import { runJob, getJobStatus } from '../controllers/job.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';

const router = express.Router();

router.post('/jobs/:jobName', authenticateJWT, isAdmin, runJob);
router.get('/jobs/:jobName/status', authenticateJWT, isAdmin, getJobStatus);

export default router;