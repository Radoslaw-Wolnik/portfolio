import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import environment from '../config/environment';

export interface IUserDocument extends Document {
  username: string;
  password: string;
  role: 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
  createDefaultAdmin(): Promise<IUserDocument>;
}

const userSchema = new Schema<IUserDocument>({
  username: { 
    type: String, 
    unique: true,
    required: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  password: { 
    type: String, 
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: { 
    type: String, 
    enum: ['admin'], 
    default: 'admin' 
  },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.createDefaultAdmin = async function(): Promise<IUserDocument> {
  const defaultAdminUsername = environment.auth.defaultAdminUsername;
  const defaultAdminPassword = environment.auth.defaultAdminPassword;

  if (!defaultAdminUsername || !defaultAdminPassword) {
    throw new Error('Default admin credentials are not set in environment variables');
  }

  const existingAdmin = await this.findOne({ username: defaultAdminUsername });

  if (existingAdmin) {
    existingAdmin.password = defaultAdminPassword;
    await existingAdmin.save();
    return existingAdmin;
  }

  const newAdmin = new this({
    username: defaultAdminUsername,
    password: defaultAdminPassword,
    role: 'admin'
  });

  await newAdmin.save();
  return newAdmin;
};

// Automatically remove the password field when calling `toJSON` or `toObject`
userSchema.methods.toJSON = function() {
  const user = this.toObject(); // Cast to type-safe object with optional password
  delete user.password;
  return user;
};

export default mongoose.model<IUserDocument, IUserModel>('User', userSchema);