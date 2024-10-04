import { Request, Response, NextFunction } from 'express';
import BlogPost, { IBlogPostDocument } from '../models/blog-post.model';
import { NotFoundError, ValidationError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const createBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, shortDescription, content, tags } = req.body;
    const blogPost = new BlogPost({ title, shortDescription, content, tags });
    await blogPost.save();
    logger.info('Blog post created', { postId: blogPost._id, createdBy: req.user?.id });
    res.status(201).json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const getBlogPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const query = tag ? { tags: tag } : {};
    const blogPosts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await BlogPost.countDocuments(query);
    res.json({
      blogPosts,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    res.json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, shortDescription, content, tags } = req.body;
    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, shortDescription, content, tags },
      { new: true, runValidators: true }
    );
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    logger.info('Blog post updated', { postId: blogPost._id, updatedBy: req.user?.id });
    res.json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    logger.info('Blog post deleted', { postId: req.params.id, deletedBy: req.user?.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};