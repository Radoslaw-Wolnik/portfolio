import express from 'express';
import { login, loginDemo, refreshToken, logout } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/login/demo', loginDemo);
router.post('/refresh-token', authenticateJWT, refreshToken);
router.post('/logout', authenticateJWT, logout);

export default router;