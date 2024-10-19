// src/models/project.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  subdomain: string;
  gitUrl: string;
  branch: string;
  dockerComposeFile: string;
  status: 'running' | 'stopped' | 'error';
  isDefault: boolean;
  httpsEnabled: boolean;
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true, unique: true },
  subdomain: { type: String, required: true, unique: true },
  gitUrl: { type: String, required: true },
  branch: { type: String, required: true, default: 'main' },
  dockerComposeFile: { type: String, required: true, default: 'docker-compose.yml' },
  status: { type: String, enum: ['running', 'stopped', 'error'], default: 'stopped' },
  isDefault: { type: Boolean, default: false },
  httpsEnabled: { type: Boolean, default: true },
});

export default mongoose.model<IProject>('Project', projectSchema);