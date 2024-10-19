import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { 
  getSiteSettings, 
  updateSiteSettings, 
  updateSEOSettings, 
  updateSocialMediaLinks, 
  updateLogo 
} from '../controllers/site-settings.controller';



const router = express.Router();

router.get('/site-settings', getSiteSettings);
router.put('/site-settings', authenticateJWT, isAdmin, updateSiteSettings);
router.put('/site-settings/seo', authenticateJWT, isAdmin, updateSEOSettings);
router.put('/site-settings/social-media', authenticateJWT, isAdmin, updateSocialMediaLinks);
router.put('/site-settings/logo', authenticateJWT, isAdmin, updateLogo);

export default router;