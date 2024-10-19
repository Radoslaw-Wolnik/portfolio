// src/routes/demo-user.routes.ts
import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import {
  createDemoUser,
  getDemoUsers,
  updateDemoUser,
  deleteDemoUser
} from '../controllers/demo-user.controller';

const router = express.Router();

router.use(authenticateJWT);

router.post('/', isAdmin, createDemoUser);
router.get('/:projectId', isAdmin, getDemoUsers);
router.put('/:id', isAdmin, updateDemoUser);
router.delete('/:id', isAdmin, deleteDemoUser);

export default router;