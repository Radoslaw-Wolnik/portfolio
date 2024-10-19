import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', authController.login);
router.post('/login-demo', authController.loginDemo);
router.post('/refresh-token', authenticateJWT, authController.refreshToken);
router.post('/logout', authenticateJWT, authController.logout);

export default router;