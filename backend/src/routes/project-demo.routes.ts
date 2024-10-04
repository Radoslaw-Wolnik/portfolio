import express from 'express';
import { authenticateDemoSession } from '../middleware/auth.middleware';
import {
  startOrJoinProjectDemo,
  getProjectDemoStatus,
  leaveProjectDemo,
  switchRole
} from '../controllers/project-demo.controller';

const router = express.Router();

router.post('/start-or-join', startOrJoinProjectDemo);
router.get('/:sessionId/status', authenticateDemoSession, getProjectDemoStatus);
router.post('/:sessionId/leave', authenticateDemoSession, leaveProjectDemo);
router.post('/:sessionId/switch-role', authenticateDemoSession, switchRole);

export default router;