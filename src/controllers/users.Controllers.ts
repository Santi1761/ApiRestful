import { Request, Response } from "express";
import { UserDocument } from "../models/users.Models"; 
import { CommentDocument } from "../models/comments.Models"; 
import userService from "../services/users.Services"; 
import { notAuthorizedError, userNotFoundError, userExistError, commentNotFoundError, notCommentAuthorError, notReactionOwnerError, reactionNotFoundError  } from "../exceptions/index"; // Asegúrate de tener estas excepciones definidas

class UserController {

    public async create(req: Request, res: Response) {
        try {
            const userCount = await userService.getUserCount();
    
            
            if (userCount === 0) {
                req.body.role = 'superadmin';
            } else if (req.body.role === 'superadmin') {
                
                if (!req.body.loggedUser || req.body.loggedUser.role !== 'superadmin') {
                    return res.status(403).json({ message: "No tienes permiso para crear un superadmin" });
                }
            }
    
            
            const user: UserDocument = await userService.create(req.body as UserDocument);
            return res.status(201).json(user);
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
    public async register(req: Request, res: Response) {
        try {
            const user: UserDocument = await userService.register(req.body as UserDocument);
            return res.status(201).json(user); 
        } catch (error) {
            if (error instanceof userExistError) {
                return res.status(400).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const userObj = await userService.login(req.body);
            return res.status(200).json(userObj);
        } catch (error) {
            if (error instanceof notAuthorizedError) {
                return res.status(401).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            
            const userIdToUpdate = req.params.id; 

            if (req.body.loggedUser.role !== 'superadmin' && req.body.loggedUser.user_id !== userIdToUpdate) {
                return res.status(403).json({ message: 'No tienes permiso para actualizar este usuario' });
            }

            const updatedUser: UserDocument | null = await userService.update(userIdToUpdate, req.body as UserDocument);

            if (!updatedUser) {
                return res.status(404).json({ message: `Usuario con ID ${userIdToUpdate} no encontrado` });
            }

            return res.json(updatedUser); 
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async getById(req: Request, res: Response) {
        try {

            const userIdToGet = req.params.id;

            if (req.body.loggedUser.role !== 'superadmin' && req.body.loggedUser.user_id !== userIdToGet) {
                return res.status(403).json({ message: 'No tienes permiso para ver este usuario' });
            }

            const user: UserDocument | null = await userService.getById(userIdToGet);

            if (!user) {
                return res.status(404).json({ message: `Usuario con ID ${userIdToGet} no encontrado` });
            }

            return res.json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async getAll(req: Request, res: Response) {
        try {

            const users: UserDocument[] = await userService.getAll();
            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            
            const userIdToDelete = req.params.id;

            const deletedUser: UserDocument | null = await userService.delete(userIdToDelete);

            if (!deletedUser) {
                return res.status(404).json({ message: `Usuario con ID ${userIdToDelete} no encontrado` });
            }

            return res.json(deletedUser); 
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}

export default new UserController();