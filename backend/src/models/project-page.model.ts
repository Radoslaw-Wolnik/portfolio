// src/models/project-page.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectPage extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const projectPageSchema = new Schema<IProjectPage>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IProjectPage>('ProjectPage', projectPageSchema);