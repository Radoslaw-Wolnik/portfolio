import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../types/global';
import BlogPost, { IBlogPostDocument } from '../models/blog-post.model';
import { NotFoundError, BadRequestError, InternalServerError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';


export const createBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blogPost = new BlogPost({
      ...req.body,
      author: req.user!._id,
      images: req.files ? (req.files as Express.Multer.File[]).map(file => file.path.replace('public/', '')) : []
    });
    await blogPost.save();
    logger.info(`Blog post created: ${blogPost._id}`, { userId: req.user!._id });
    res.status(201).json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const getBlogPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tag = req.query.tag as string | undefined;

    const query = tag ? { tags: tag } : {};
    const totalPosts = await BlogPost.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const blogPosts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      blogPosts,
      currentPage: page,
      totalPages,
      totalPosts
    });
  } catch (error) {
    next(new InternalServerError('Error fetching blog posts'));
  }
}

export const getBlogPostById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }
    res.json(blogPost);
  } catch (error) {
    next(error);
  }
}

export const updateBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }

    if (blogPost.author.toString() !== req.user!.id.toString() && req.user!.role !== 'admin') {
      throw new BadRequestError('You do not have permission to update this post');
    }

    Object.assign(blogPost, req.body);
    await blogPost.save();

    logger.info(`Blog post updated: ${req.params.id}`, { userId: req.user!._id });
    res.json(blogPost);
  } catch (error) {
    next(error);
  }
}

export const deleteBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      throw new NotFoundError('Blog post not found');
    }

    if (blogPost.author.toString() !== req.user!.id.toString() && req.user!.role !== 'admin') {
      throw new BadRequestError('You do not have permission to delete this post');
    }

    await blogPost.deleteOne();
    logger.info(`Blog post deleted: ${req.params.id}`, { userId: req.user!._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const searchBlogPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { query } = req.query;
    if (typeof query !== 'string') {
      throw new BadRequestError('Invalid search query');
    }

    const results = await BlogPost.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.json(results);
  } catch (error) {
    next(error);
  }
}
