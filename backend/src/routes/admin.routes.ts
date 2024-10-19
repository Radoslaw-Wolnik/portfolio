import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { getDashboardStats, getSystemLogs }  from '../controllers/admin.controller';

const router = express.Router();


router.get('/admin/dashboard', authenticateJWT, isAdmin, getDashboardStats);
router.get('/admin/logs', authenticateJWT, isAdmin, getSystemLogs);

export default router;