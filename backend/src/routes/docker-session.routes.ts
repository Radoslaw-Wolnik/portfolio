// src/routes/session.routes.ts
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { createSession, getSession, listUserSessions, terminateSession, getSessionStats, swapUser } from '../controllers/dokcer-sessions.controller';

const router = express.Router();

router.use(authenticateJWT);

router.post('/docker-sessions', authenticateJWT, createSession);
router.get('/docker-sessions/:sessionId', authenticateJWT, getSession);
router.get('/docker-sessions', authenticateJWT, listUserSessions);
router.delete('/docker-sessions/:sessionId', authenticateJWT, terminateSession);
router.get('/docker-sessions/stats', authenticateJWT, isAdmin, getSessionStats);
router.put('/docker-sessions/:sessionId/swap-user', authenticateJWT, swapUser);

export default router;