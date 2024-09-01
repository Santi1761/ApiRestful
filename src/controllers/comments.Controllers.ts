import { Request, Response } from 'express';
import commentService from '../services/comments.Services';
import { CommentDocument } from '../models/comments.Models';
import { commentNotFoundError, notCommentAuthorError } from '../exceptions/index';

class CommentController {
    public async create(req: Request, res: Response) {
        try {
            const commentData = req.body as CommentDocument;
            commentData.author = req.body.loggedUser.user_id;

            const comment = await commentService.create(commentData);
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Error creating comment', error });
        }
    }

    public async getAll(req: Request, res: Response) {
        try {
            const comments = await commentService.getAll();
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching comments', error });
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const comment = await commentService.getById(id);
            if (!comment) {
                throw new commentNotFoundError(`Comment with ID ${id} not found`);
            }
            res.status(200).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching comment', error });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const comment = await commentService.getById(id);

            if (!comment) {
                throw new commentNotFoundError(`Comment with ID ${id} not found`);
            }

            if (comment.author.toString() !== req.body.loggedUser.user_id) {
                throw new notCommentAuthorError('You are not authorized to update this comment');
            }

            const updatedComment = await commentService.update(id, req.body);
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ message: 'Error updating comment', error });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const comment = await commentService.getById(id);

            if (!comment) {
                throw new commentNotFoundError(`Comment with ID ${id} not found`);
            }

            if (comment.author.toString() !== req.body.loggedUser.user_id) {
                throw new notCommentAuthorError('You are not authorized to delete this comment');
            }

            await commentService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting comment', error });
        }
    }
}

export default new CommentController();