import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPostDocument extends Document {
  title: string;
  shortDescription: string;
  content: [{
    type: 'text' | 'code' | 'image' | 'link';
    content: string;
    language?: string; // for code blocks
    alt?: string; // for images
  }];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPostDocument>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: [{
    type: { type: String, enum: ['text', 'code', 'image', 'link'], required: true },
    content: { type: String, required: true },
    language: String,
    alt: String,
  }],
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IBlogPostDocument>('BlogPost', blogPostSchema);