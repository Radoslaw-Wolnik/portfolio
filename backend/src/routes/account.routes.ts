// src/routes/account.routes.ts
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import * as accountController from '../controllers/account.controller';

const router = express.Router();

router.use(authenticateJWT);

router.put('/', accountController.updateAccount);
router.put('/change-password', accountController.changePassword);
router.delete('/', accountController.deleteAccount);

export default router;