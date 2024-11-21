import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/users.Models";

export const validateToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;

        if (!decoded || !decoded.user_id) {
            throw new Error("Token inválido");
        }

        return {
            user_id: decoded.user_id,
            email: decoded.email,
            role: decoded.role,
        };
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new Error("Token expirado");
        }
        throw new Error("Token inválido");
    }
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "No autorizado" });
        }

        token = token.replace("Bearer ", "");
        const loggedUser = validateToken(token);

        req.body.loggedUser = loggedUser;
        next();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ message: error.message });
        }
        return res.status(401).json({ message: "Unknown error" });
    }
};

export default authMiddleware;
