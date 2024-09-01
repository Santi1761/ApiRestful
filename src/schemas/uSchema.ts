import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string; 
  role: 'superadmin' | 'user';
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'user'], required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);