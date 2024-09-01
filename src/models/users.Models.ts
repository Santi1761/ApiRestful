import mongoose, { Schema, Document } from 'mongoose';
import userSchema from '../schemas/users.Schemas';

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string; 
    role: 'superadmin' | 'user'; 
}

const mongooseUserSchema = new Schema<UserDocument>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['superadmin', 'user'], 
        required: true 
    }
});

const User = mongoose.model<UserDocument>('User', mongooseUserSchema);

export default User;