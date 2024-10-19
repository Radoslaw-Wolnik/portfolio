// src/routes/session.routes.ts
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import * as sessionController from '../controllers/dokcer-sessions.controller';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', sessionController.getUserSessions);
router.delete('/:id', sessionController.deleteSession);
router.delete('/', sessionController.deleteAllSessions);

export default router;