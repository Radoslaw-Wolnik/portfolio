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
import { uploadBlogImages } from '../middleware/upload.middleware';

const router = express.Router();

router.post('/blog-posts', authenticateJWT, uploadBlogImages, createBlogPost);
router.get('/blog-posts', getBlogPosts);
router.get('/blog-posts/:id', getBlogPostById);
router.put('/blog-posts/:id', authenticateJWT, updateBlogPost);
router.delete('/blog-posts/:id', authenticateJWT, deleteBlogPost);
router.get('/blog-posts/search', searchBlogPosts);

export default router;