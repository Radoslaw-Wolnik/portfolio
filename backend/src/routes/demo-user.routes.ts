import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { createDemoUser, updateDemoUser, deleteDemoUser, getDemoUsers } from '../controllers/demo-user.controller';

const router = express.Router();

router.use(authenticateJWT, isAdmin);

router.post('/demo-users', createDemoUser);
router.put('/demo-users/:id', updateDemoUser);
router.delete('/demo-users/:id', deleteDemoUser);
router.get('/demo-users/:projectId', getDemoUsers);

export default router;