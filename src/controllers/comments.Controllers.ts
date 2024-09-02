import { Request, Response } from 'express';
import commentService from '../services/comments.Services';
import { CommentDocument } from '../models/comments.Models';
import { createCommentSchema, updateCommentSchema } from '../schemas/comments.Schemas';
import { commentNotFoundError, notCommentAuthorError } from '../exceptions/index';

class CommentController {
    // Crear un nuevo comentario
    public async create(req: Request, res: Response): Promise<void> {
        try {
            // Extraer solo los datos necesarios de req.body
            const { content, parentId, reactions } = req.body;
            const commentData = {
                content,
                author: req.body.loggedUser.user_id, // Usamos el ID del usuario autenticado
                parentId,
                reactions,
            } as CommentDocument;

            // Validar el cuerpo de la solicitud usando Joi
            const { error } = createCommentSchema.validate(commentData);
            if (error) {
                res.status(400).json({ message: 'Invalid input', error: error.details });
                return;
            }

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

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const comment = await commentService.getById(id);
    
            if (!comment) {
                res.status(404).json({ message: `Comment with ID ${id} not found` });
                return;
            }
    
            // Verificar si el usuario es el autor del comentario
            const loggedUserId = req.body.loggedUser.user_id;
    
            // Log IDs para verificación
            console.log('Author ID:', comment.author.toString());
            console.log('Logged User ID:', loggedUserId.toString());
    
           
    
            // Extraer solo los datos necesarios de req.body
            const { content, parentId, reactions } = req.body;
            const commentData = { content, parentId, reactions } as Partial<CommentDocument>;
    
            // Validar el cuerpo de la solicitud usando Joi
            const { error } = updateCommentSchema.validate(commentData);
            if (error) {
                res.status(400).json({ message: 'Invalid input', error: error.details });
                return;
            }
    
            // Actualizar el comentario
            const updatedComment = await commentService.update(id, commentData);
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

          

            // Eliminar el comentario
            await commentService.delete(id);
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting comment', error });
        }
    }


    
 // Responder a un comentario existente (crear un hilo)
 public async reply(req: Request, res: Response): Promise<void> {
    try {
        const { content, author } = req.body;  // Obtenemos author de req.body
        const parentId = req.params.id; // ID del comentario al que se responde

        const parentComment = await commentService.getById(parentId);
        if (!parentComment) {
            res.status(404).json({ message: `Comment with ID ${parentId} not found` });
            return;
        }

        const replyData: CommentDocument = {
            content,
            author,  // Usamos el author que se pasa en el cuerpo de la solicitud
            parentId: parentComment._id
        } as CommentDocument;

        const reply = await commentService.create(replyData);
        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ message: 'Error replying to comment', error });
    }
}

public async getReactions(req: Request, res: Response): Promise<void> {
    try {
        const commentId = req.params.id;
        const comment = await commentService.getById(commentId);
        if (!comment) {
            res.status(404).json({ message: `Comment with ID ${commentId} not found` });
            return;
        }

        const reactions = comment.reactions || [];
        res.status(200).json(reactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reactions', error });
    }
}

public async addReaction(req: Request, res: Response): Promise<void> {
    try {
        const { type, author } = req.body;
        const commentId = req.params.id;

        const comment = await commentService.getById(commentId);
        if (!comment) {
            res.status(404).json({ message: `Comment with ID ${commentId} not found` });
            return;
        }

        
        if (!comment.reactions) {
            comment.reactions = [];
        }

        
        comment.reactions.push({
            user: author,
            type
        });

        const updatedComment = await comment.save();
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding reaction', error });
    }
}

public async removeReaction(req: Request, res: Response): Promise<void> {
    try {
        const { author, type } = req.body;
        const commentId = req.params.id;

        const comment = await commentService.getById(commentId);
        if (!comment) {
            res.status(404).json({ message: `Comment with ID ${commentId} not found` });
            return;
        }

       
        if (!comment.reactions) {
            comment.reactions = [];
        }

        // Filtrar para eliminar la reacción del usuario actual
        comment.reactions = comment.reactions.filter(reaction => {
            return !(reaction.user.toString() === author.toString() && reaction.type === type);
        });

        const updatedComment = await comment.save();
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error removing reaction', error });
    }
}




}


export default new CommentController();
