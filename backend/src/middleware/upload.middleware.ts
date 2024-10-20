import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { getMulterMiddleware } from './multer.middleware';
import fs from 'fs';
import path from 'path';

// Extend the Request interface to include multerStorage
interface MulterRequest extends Request {
  multerStorage?: multer.StorageEngine; // Added multerStorage property
  user?: {
    _id: string;
  };
}

// Utility function to define the correct upload path based on fieldname
const defineUploadPath = (req: MulterRequest, file: Express.Multer.File): string => {
  let uploadPath: string;

  if (file.fieldname === 'blogImages') {
    const blogId = req.params.blogId || 'temp';
    uploadPath = `public/uploads/blog/${blogId}`;
  } else if (file.fieldname === 'projectImages') {
    const projectId = req.params.projectId || 'temp';
    uploadPath = `public/uploads/projects/page/${projectId}`;
  } else if (file.fieldname === 'profileImage') {
    const userId = req.user ? req.user._id : 'Anonymous';
    uploadPath = `public/uploads/profile/${userId}`;
  } else {
    throw new Error('Invalid field name');
  }

  fs.mkdirSync(uploadPath, { recursive: true });
  return uploadPath;
};

// Middleware to handle the dynamic upload path
const dynamicUploadMiddleware = (req: MulterRequest, res: Response, next: NextFunction) => {
  const storage = multer.diskStorage({
    destination: (req: MulterRequest, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      try {
        const uploadPath = defineUploadPath(req, file);
        cb(null, uploadPath);
      } catch (err) {
        cb(err as Error, '');
      }
    },
    filename: (req: MulterRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = `${Date.now()}-${path.extname(file.originalname)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}`);
    }
  });

  req.multerStorage = storage; // Assign the storage to the request object
  next();
};

// Combine the dynamic storage setup with multer configuration
const multerMiddleware = (req: MulterRequest) => {
  const storage = req.multerStorage || multer.diskStorage({});
  return getMulterMiddleware(storage);
};

// Export specific upload middlewares for different routes
export const uploadBlogImages = [
  dynamicUploadMiddleware,
  (req: Request, res: Response, next: NextFunction) => multerMiddleware(req).array('blogImages', 5)(req, res, next)
];

export const uploadProjectImages = [
  dynamicUploadMiddleware,
  (req: Request, res: Response, next: NextFunction) => multerMiddleware(req).array('projectImages', 10)(req, res, next)
];

export const uploadProfileImage = [
  dynamicUploadMiddleware,
  (req: Request, res: Response, next: NextFunction) => multerMiddleware(req).single('profileImage')(req, res, next)
];

