import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPostDocument extends Document {
  title: string;
  shortDescription: string;
  content: [{
    type: 'text' | 'code' | 'image' | 'link';
    content: string;
    language?: string;
    alt?: string;
  }];
  tags: string[];
  author: mongoose.Types.ObjectId;
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
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Add text index for search functionality
blogPostSchema.index({ title: 'text', shortDescription: 'text', 'content.content': 'text', tags: 'text' });

export default mongoose.model<IBlogPostDocument>('BlogPost', blogPostSchema);