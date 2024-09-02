import { Request, Response } from "express";
import { CommentDocument } from "../models/comments.Models"; 
import commentService from "../services/comments.Services";
import { notAuthorizedError, commentNotFoundError, notCommentAuthorError, notReactionOwnerError, reactionNotFoundError } from "../exceptions/index"; 

class CommentController {

    public async create(req: Request, res: Response) {
        try {
            const comment: CommentDocument = await commentService.create(req.body as CommentDocument);
            return res.status(201).json(comment);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const commentIdToUpdate = req.params.id;

            const existingComment: CommentDocument | null = await commentService.getById(commentIdToUpdate);

            if (!existingComment) {
                throw new commentNotFoundError(`Comentario con ID ${commentIdToUpdate} no encontrado`);
            }

            if (req.body.loggedUser.user_id !== existingComment.author.toString()) {
                throw new notCommentAuthorError("No tienes permiso para actualizar este comentario");
            }

            const updatedComment: CommentDocument | null = await commentService.update(commentIdToUpdate, req.body as CommentDocument);

            return res.json(updatedComment); 
        } catch (error) {
            if (error instanceof commentNotFoundError || error instanceof notCommentAuthorError) {
                return res.status(403).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const commentIdToGet = req.params.id;

            const comment: CommentDocument | null = await commentService.getById(commentIdToGet);

            if (!comment) {
                throw new commentNotFoundError(`Comentario con ID ${commentIdToGet} no encontrado`);
            }

            return res.json(comment);
        } catch (error) {
            if (error instanceof commentNotFoundError) {
                return res.status(404).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async getAll(req: Request, res: Response) {
        try {
            const comments: CommentDocument[] = await commentService.getAll();
            return res.json(comments);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const commentIdToDelete = req.params.id;

            const existingComment: CommentDocument | null = await commentService.getById(commentIdToDelete);

            if (!existingComment) {
                throw new commentNotFoundError(`Comentario con ID ${commentIdToDelete} no encontrado`);
            }

            if (req.body.loggedUser.role !== 'superadmin' && req.body.loggedUser.user_id !== existingComment.author.toString()) {
                throw new notCommentAuthorError("No tienes permiso para eliminar este comentario");
            }

            const deletedComment: CommentDocument | null = await commentService.delete(commentIdToDelete);

            return res.json(deletedComment); 
        } catch (error) {
            if (error instanceof commentNotFoundError || error instanceof notCommentAuthorError) {
                return res.status(403).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async addReaction(req: Request, res: Response) {
        try {
            const commentId = req.params.id;
            const reaction = { user: req.body.loggedUser.user_id, type: req.body.type };

            const updatedComment: CommentDocument | null = await commentService.addReaction(commentId, reaction);

            if (!updatedComment) {
                throw new commentNotFoundError(`Comentario con ID ${commentId} no encontrado`);
            }

            return res.json(updatedComment);
        } catch (error) {
            if (error instanceof commentNotFoundError) {
                return res.status(404).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async removeReaction(req: Request, res: Response) {
        try {
            const commentId = req.params.id;
            const reactionId = req.body.reactionId;

            const existingComment: CommentDocument | null = await commentService.getById(commentId);

            if (!existingComment) {
                throw new commentNotFoundError(`Comentario con ID ${commentId} no encontrado`);
            }

            const reaction = existingComment.reactions?.find(reaction => reaction.id.toString() === reactionId);
            
            if (!reaction) {
                throw new reactionNotFoundError(`Reacción con ID ${reactionId} no encontrada`);
            }

            if (req.body.loggedUser.user_id !== reaction.user.toString()) {
                throw new notReactionOwnerError("No tienes permiso para eliminar esta reacción");
            }

            const updatedComment: CommentDocument | null = await commentService.removeReaction(commentId, reactionId);

            return res.json(updatedComment);
        } catch (error) {
            if (error instanceof commentNotFoundError || error instanceof reactionNotFoundError || error instanceof notReactionOwnerError) {
                return res.status(403).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}

export default new CommentController();