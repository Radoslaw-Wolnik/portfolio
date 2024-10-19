import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import * as adminController from '../controllers/admin.controller';

const router = express.Router();

router.use(authenticateJWT, isAdmin);

router.get('/dashboard-stats', adminController.getDashboardStats);
router.post('/manage-users', adminController.manageUsers);
router.post('/manage-demo-users', adminController.manageDemoUsers);
router.get('/system-logs', adminController.getSystemLogs);
router.put('/system-configuration', adminController.manageSystemConfiguration);

export default router;