import { Request, Response } from 'express';
import commentService from '../services/comments.Services';
import { CommentDocument } from '../models/comments.Models';
import { createCommentSchema, updateCommentSchema } from '../schemas/comments.Schemas';
import { commentNotFoundError, notCommentAuthorError } from '../exceptions/index';

class CommentController {
    // Crear un nuevo comentario
    public async create(req: Request, res: Response): Promise<void> {
        try {
            // Validar el cuerpo de la solicitud usando Joi
            const { error } = createCommentSchema.validate(req.body);
            if (error) {
                res.status(400).json({ message: 'Invalid input', error: error.details });
                return;
            }

            // Preparar los datos del comentario
            const commentData = req.body as CommentDocument;
            commentData.author = req.body.loggedUser.user_id;

            // Crear el comentario
            const comment = await commentService.create(commentData);
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Error creating comment', error });
        }
    }

    // Obtener todos los comentarios
    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const comments = await commentService.getAll();
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching comments', error });
        }
    }

    // Obtener un comentario por su ID
    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const comment = await commentService.getById(id);

            if (!comment) {
                res.status(404).json({ message: `Comment with ID ${id} not found` });
                return;
            }

            res.status(200).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching comment', error });
        }
    }

    // Actualizar un comentario existente
    public async update(req: Request, res: Response): Promise<void> {
        try {
            // Validar el cuerpo de la solicitud usando Joi
            const { error } = updateCommentSchema.validate(req.body);
            if (error) {
                res.status(400).json({ message: 'Invalid input', error: error.details });
                return;
            }

            const { id } = req.params;
            const comment = await commentService.getById(id);

            if (!comment) {
                res.status(404).json({ message: `Comment with ID ${id} not found` });
                return;
            }

            // Verificar si el usuario es el autor del comentario
            if (comment.author.toString() !== req.body.loggedUser.user_id) {
                res.status(403).json({ message: 'You are not authorized to update this comment' });
                return;
            }

            // Actualizar el comentario
            const updatedComment = await commentService.update(id, req.body);
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ message: 'Error updating comment', error });
        }
    }

    // Eliminar un comentario
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const comment = await commentService.getById(id);

            if (!comment) {
                res.status(404).json({ message: `Comment with ID ${id} not found` });
                return;
            }

            // Verificar si el usuario es el autor del comentario
            if (comment.author.toString() !== req.body.loggedUser.user_id) {
                res.status(403).json({ message: 'You are not authorized to delete this comment' });
                return;
            }

            // Eliminar el comentario
            await commentService.delete(id);
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting comment', error });
        }
    }
}

export default new CommentController();
