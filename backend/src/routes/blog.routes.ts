import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  searchBlogPosts
} from '../controllers/blog-post.controller';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/search', searchBlogPosts);
router.get('/:id', getBlogPostById);

router.use(authenticateJWT);
router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

export default router;