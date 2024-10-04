// project.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectDocument extends Document {
  name: string;
  description: string;
  dockerComposeFile: string;
  availableRoles: string[];
}

const projectSchema = new Schema<IProjectDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  dockerComposeFile: { type: String, required: true },
  availableRoles: [{ type: String }],
});

export default mongoose.model<IProjectDocument>('Project', projectSchema);

