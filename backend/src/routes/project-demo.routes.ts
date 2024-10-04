// project-demo.routes.ts
import express from 'express';
import { 
  startOrJoinProjectDemo, 
  getProjectDemoStatus, 
  leaveProjectDemo 
} from '../controllers/project-demo.controller';

const router = express.Router();

router.post('/start-or-join', startOrJoinProjectDemo);
router.post('/leave', leaveProjectDemo);
router.get('/:sessionId/status', getProjectDemoStatus);

export default router;