import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import User from "../models/users.Models";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCount = await User.countDocuments();

        console.log(`User count: ${userCount}`);
        console.log(`Request method: ${req.method}`);
        console.log(`Request originalUrl: ${req.originalUrl}`);
        console.log(`Request path: ${req.path}`);

        
        if (userCount === 0 && req.method === "POST" && req.originalUrl === "/api/users/") {
            console.log("Creating first user - skipping auth");
            return next();
        }

        
        let token: string | undefined = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "No autorizado" });
        }

        
        token = token.replace("Bearer ", ""); 

        
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

        
        if (!decoded || !decoded.user_id) {
            return res.status(401).json({ message: "Token inválido" });
        }

       
        req.body.loggedUser = {
            user_id: decoded.user_id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: "Token expirado", error });
        } else {
            return res.status(401).json({ message: "Token inválido", error });
        }
    }
};

export default authMiddleware;