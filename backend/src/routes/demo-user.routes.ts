import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { createDemoUser, updateDemoUser, deleteDemoUser, getDemoUsers } from '../controllers/demo-user.controller';

const router = express.Router();

router.use(authenticateJWT);
router.use(isAdmin);

router.post('/', createDemoUser);
router.get('/:projectId', getDemoUsers);
router.put('/:id', updateDemoUser);
router.delete('/:id', deleteDemoUser);

export default router;