import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  gitUrl: string;
  branch: string;
  dockerComposeFile: string;
  status: 'running' | 'stopped' | 'error';
  isPortfolioProject: boolean;
  subdomain: string;
  defaultUsername?: string;
  defaultPassword?: string;
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true, unique: true },
  gitUrl: { type: String, required: true },
  branch: { type: String, required: true, default: 'main' },
  dockerComposeFile: { type: String, required: true, default: 'docker-compose.yml' },
  status: { type: String, enum: ['running', 'stopped', 'error'], default: 'stopped' },
  isPortfolioProject: { type: Boolean, default: false },
  subdomain: { type: String, required: true, unique: true },
  defaultUsername: { type: String },
  defaultPassword: { type: String },
});

export default mongoose.model<IProject>('Project', projectSchema);