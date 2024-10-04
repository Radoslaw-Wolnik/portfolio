import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blog-post.controller';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/:id', getBlogPostById);

router.use(authenticateJWT, isAdmin);
router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

export default router;