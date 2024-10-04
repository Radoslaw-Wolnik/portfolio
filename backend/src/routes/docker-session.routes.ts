import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import {
  startDockerSession,
  endDockerSession,
  getDockerSessionStats
} from '../controllers/docker-session.controller';

const router = express.Router();

router.post('/start', startDockerSession);
router.put('/:id/end', endDockerSession);

router.use(authenticateJWT, isAdmin);
router.get('/stats', getDockerSessionStats);

export default router;