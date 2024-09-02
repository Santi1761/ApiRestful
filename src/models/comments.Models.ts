import mongoose, { Schema, Document, Types } from 'mongoose';

export interface CommentDocument extends Document {
    content: string;
    author: Types.ObjectId; 
    parentId?: Types.ObjectId; 
    reactions?: { id: Types.ObjectId, user: Types.ObjectId, type: string }[];
}

const commentSchema = new Schema<CommentDocument>({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    reactions: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, required: true },
        id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() }
    }]
}, { timestamps: true });


const Comment = mongoose.model<CommentDocument>('Comment', commentSchema);

export default Comment;