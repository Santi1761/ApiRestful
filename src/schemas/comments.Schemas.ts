import Joi from 'joi';
import { Types } from 'mongoose';

export const createCommentSchema = Joi.object({
    content: Joi.string().required().messages({
        'string.base': 'El contenido debe ser un texto.',
        'string.empty': 'El contenido no puede estar vacío.',
        'any.required': 'El contenido es obligatorio.'
    }),
    author: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'ObjectId validation').required().messages({
        'any.invalid': 'El ID del autor no es válido.',
        'any.required': 'El ID del autor es obligatorio.'
    }),
    parentId: Joi.string().allow(null).custom((value, helpers) => {
        if (value && !Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'ObjectId validation').optional(),
    reactions: Joi.array().items(
        Joi.object({
            user: Joi.string().custom((value, helpers) => {
                if (!Types.ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'ObjectId validation').required(),
            type: Joi.string().required().messages({
                'string.base': 'El tipo de reacción debe ser un texto.',
                'string.empty': 'El tipo de reacción no puede estar vacío.',
                'any.required': 'El tipo de reacción es obligatorio.'
            })
        })
    ).optional()
});

export const updateCommentSchema = Joi.object({
    content: Joi.string().optional().messages({
        'string.base': 'El contenido debe ser un texto.',
        'string.empty': 'El contenido no puede estar vacío.',
    }),
    parentId: Joi.string().allow(null).optional().custom((value, helpers) => {
        if (value && !Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'ObjectId validation').optional(),
    reactions: Joi.array().items(
        Joi.object({
            user: Joi.string().custom((value, helpers) => {
                if (!Types.ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'ObjectId validation').required(),
            type: Joi.string().required().messages({
                'string.base': 'El tipo de reacción debe ser un texto.',
                'string.empty': 'El tipo de reacción no puede estar vacío.',
                'any.required': 'El tipo de reacción es obligatorio.'
            })
        })
    ).optional()
});
