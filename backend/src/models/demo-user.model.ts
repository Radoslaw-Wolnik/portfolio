import mongoose, { Document, Schema } from 'mongoose';

export interface IDemoUserDocument extends Document {
  username: string;
  sessionId: Schema.Types.ObjectId;
  createdAt: Date;
}

const demoUserSchema = new Schema<IDemoUserDocument>({
  username: { type: String, required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'DockerSession', required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Automatically delete after 24 hours
});

export default mongoose.model<IDemoUserDocument>('DemoUser', demoUserSchema);