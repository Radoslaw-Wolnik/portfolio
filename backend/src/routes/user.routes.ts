import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { getUserProfile, updateProfile, getAllUsers, getUserById, deleteUser } from '../controllers/user.controller';

const router = express.Router();

router.use(authenticateJWT);

router.get('/users/profile', authenticateJWT, getUserProfile);
router.put('/users/profile', authenticateJWT, updateProfile);
router.get('/users', authenticateJWT, isAdmin, getAllUsers);
router.get('/users/:id', authenticateJWT, isAdmin, getUserById);
router.delete('/users/:id', authenticateJWT, isAdmin, deleteUser);

export default router;