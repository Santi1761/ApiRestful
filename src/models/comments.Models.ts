import mongoose, { Schema, Document, Types } from 'mongoose';

export interface CommentDocument extends Document {
    content: string;
    author: Types.ObjectId;
    parentId?: Types.ObjectId;
    reactions?: { user: Types.ObjectId, type: string }[];
}

const commentSchema = new Schema<CommentDocument>({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },  // Referencia a otro comentario
    reactions: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, required: true }
    }]
}, { timestamps: true });

const Comment = mongoose.model<CommentDocument>('Comment', commentSchema);

export default Comment;
