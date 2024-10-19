import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { getUserProfile, updateProfile } from '../controllers/user.controller';

const router = express.Router();

router.use(authenticateJWT);

router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);

export default router;