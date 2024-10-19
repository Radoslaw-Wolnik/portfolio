// src/routes/account.routes.ts
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { updateAccount, changePassword, deleteAccount } from '../controllers/account.controller';

const router = express.Router();

router.put('/account', authenticateJWT, updateAccount);
router.put('/account/change-password', authenticateJWT, changePassword);
router.delete('/account', authenticateJWT, deleteAccount);

export default router;