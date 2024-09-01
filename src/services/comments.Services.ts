import Comment, { CommentDocument } from "../models/comments.Models";

class CommentService {
    public async create(commentData: CommentDocument): Promise<CommentDocument> {
        try {
            const comment = await Comment.create(commentData);
            return comment;
        } catch (error) {
            throw error;
        }
    }

    public async getAll(): Promise<CommentDocument[]> {
        try {
            const comments = await Comment.find().populate('author'); 
            return comments;
        } catch (error) {
            throw error;
        }
    }

    public async getById(id: string): Promise<CommentDocument | null> {
        try {
            const comment = await Comment.findById(id).populate('author'); 
            return comment;
        } catch (error) {
            throw error;
        }
    }

    public async update(id: string, commentData: Partial<CommentDocument>): Promise<CommentDocument | null> {
        try {
            const comment = await Comment.findByIdAndUpdate(id, commentData, { new: true });
            return comment;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<CommentDocument | null> {
        try {
            const comment = await Comment.findByIdAndDelete(id);
            return comment;
        } catch (error) {
            throw error;
        }
    }

}

export default new CommentService();