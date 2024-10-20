import mongoose, { Document, Schema } from 'mongoose';

export interface IDockerSession extends Document {
  sessionId: string;
  userId: Schema.Types.ObjectId;
  projectName: string;
  username: string;
  containerSessionId: string;
  startTime: Date;
  endTime?: Date;
  lastActivityTime: Date;
  lastSwitchTime?: Date;
  status: 'active' | 'terminated';
  isPublic: Boolean;
}

const dockerSessionSchema = new Schema<IDockerSession>({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectName: { type: String, required: true },
  username: { type: String, required: true },
  containerSessionId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  lastActivityTime: { type: Date, default: Date.now },
  lastSwitchTime: { type: Date },
  status: { type: String, enum: ['active', 'terminated'], default: 'active' },
  isPublic: {type: Boolean, default: false},
});

dockerSessionSchema.index({ userId: 1, status: 1 });
dockerSessionSchema.index({ lastActivityTime: 1 }, { expireAfterSeconds: 86400 }); // Auto-delete after 24 hours of inactivity

export default mongoose.model<IDockerSession>('DockerSession', dockerSessionSchema);