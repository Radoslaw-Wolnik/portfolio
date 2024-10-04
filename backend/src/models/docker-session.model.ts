// dockersession.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDockerSessionDocument extends Document {
  projectName: string;
  containerId: string;
  activeUsers: {
    userId: Schema.Types.ObjectId;
    username: string;
    role: string;
  }[];
  ipAddress: string;
  startTime: Date;
  endTime?: Date;
}

const dockerSessionSchema = new Schema<IDockerSessionDocument>({
  projectName: { type: String, required: true },
  containerId: { type: String, required: true },
  activeUsers: [{
    userId: { type: Schema.Types.ObjectId, ref: 'DemoUser', required: true },
    username: { type: String, required: true },
    role: { type: String, required: true }
  }],
  ipAddress: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
});

export default mongoose.model<IDockerSessionDocument>('DockerSession', dockerSessionSchema);