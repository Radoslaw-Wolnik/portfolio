// src/models/session.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDockerSession extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}

const dockerSessionSchema = new Schema<IDockerSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
});

export default mongoose.model<IDockerSession>('DockerSession', dockerSessionSchema);
