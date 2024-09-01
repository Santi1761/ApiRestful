import { Request, Response, NextFunction } from "express";

const roleMiddleware = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.body.loggedUser?.role; 

        console.log("roleMiddleware - userRole:", userRole);
        console.log("roleMiddleware - allowedRoles:", allowedRoles); 

        if (!userRole && req.body.loggedUser === undefined) {
            console.log("No user authenticated, skipping role check.");
            return next();
        }

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Acceso denegado. No tienes el rol necesario." });
        }

        next();
    };
};

export default roleMiddleware;
