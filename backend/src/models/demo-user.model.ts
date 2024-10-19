import mongoose, { Document, Schema } from 'mongoose';

export interface IDemoUser extends Document {
  username: string;
  password: string;
  project: Schema.Types.ObjectId;
  role: string;
  createdAt: Date;
}

const demoUserSchema = new Schema<IDemoUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Automatically delete after 24 hours ------ idk if i want that
});

// Automatically remove the password field when calling `toJSON` or `toObject`
demoUserSchema.methods.toJSON = function() {
  const user = this.toObject(); // const user = this.toObject() as IDemoUser & { password?: string };
  delete user.password;
  return user;
};

demoUserSchema.index({ username: 1, project: 1 }, { unique: true });

export default mongoose.model<IDemoUser>('DemoUser', demoUserSchema);