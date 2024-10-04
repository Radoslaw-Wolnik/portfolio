import mongoose, { Document, Schema } from 'mongoose';

export interface IDemoCredentials extends Document {
  projectName: string;
  username: string;
  password: string;
  role: string;
}

const demoCredentialsSchema = new Schema<IDemoCredentials>({
  projectName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

demoCredentialsSchema.index({ projectName: 1, username: 1 }, { unique: true });

export default mongoose.model<IDemoCredentials>('DemoCredentials', demoCredentialsSchema);