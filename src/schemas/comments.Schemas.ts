import { object, string, TypeOf, array, optional } from 'zod';
import mongoose from 'mongoose';

const commentSchema = object({
    content: string({
        required_error: "El contenido es requerido",
    }).min(1, "El contenido no puede estar vacío"),
    
    author: string({
        required_error: "El autor es requerido",
    }).refine(value => mongoose.Types.ObjectId.isValid(value), {
        message: "El autor debe ser un ObjectId válido"
    }),

    parentId: optional(string().refine(value => mongoose.Types.ObjectId.isValid(value), {
        message: "El parentId debe ser un ObjectId válido"
    })),

    reactions: optional(array(object({
        user: string({
            required_error: "El usuario es requerido",
        }).refine(value => mongoose.Types.ObjectId.isValid(value), {
            message: "El usuario debe ser un ObjectId válido"
        }),
        type: string({
            required_error: "El tipo de reacción es requerido",
        }).min(1, "El tipo de reacción no puede estar vacío")
    })))
});

export type CommentSchema = TypeOf<typeof commentSchema>;

export default commentSchema;
