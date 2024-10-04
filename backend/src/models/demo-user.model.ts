// demo-user.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDemoUserDocument extends Document {
  username: string;
  password: string;
  role: string;
  projectId: Schema.Types.ObjectId;
}

const demoUserSchema = new Schema<IDemoUserDocument>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
});

export default mongoose.model<IDemoUserDocument>('DemoUser', demoUserSchema);