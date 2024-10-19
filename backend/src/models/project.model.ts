import mongoose, { Document, Schema } from 'mongoose';

export interface IContainer {
  name: string;
  port: number;
  type: 'frontend' | 'backend' | 'database' | 'other';
}

export interface IProject extends Document {
  name: string;
  gitUrl: string;
  branch: string;
  dockerComposeFile: string;
  subdomain: string;
  status: 'running' | 'stopped' | 'error' | 'frozen';
  containers: IContainer[];
}

const containerSchema = new Schema<IContainer>({
  name: { type: String, required: true },
  port: { type: Number, required: true },
  type: { type: String, enum: ['frontend', 'backend', 'database', 'other'], required: true }
});

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true, unique: true },
  gitUrl: { type: String, required: true },
  branch: { type: String, required: true, default: 'main' },
  dockerComposeFile: { type: String, required: true, default: 'docker-compose.yml' },
  subdomain: { type: String, required: true, unique: true },
  status: { type: String, enum: ['running', 'stopped', 'error', 'frozen'], default: 'stopped' },
  containers: [containerSchema]
});

export default mongoose.model<IProject>('Project', projectSchema);