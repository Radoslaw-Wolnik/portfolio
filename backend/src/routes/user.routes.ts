import express, { Router } from 'express';
import  { authenticateJWT } from '../middleware/auth.middleware';
import { 
  getUserProfile,  
  updateProfile,

} from '../controllers/user.controller.js';


const router: Router = express.Router();

// only for logged-in users
router.use(authenticateJWT);

router.get('/:id', getUserProfile);

router.put('/profile', updateProfile);

export default router;
