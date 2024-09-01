import express, { Request, Response } from "express";
import userController from "../controllers/users.Controllers";
import validateSchema from "../middlewares/validate";
import userSchema from "../schemas/users.Schemas";
import authMiddleware from "../middlewares/auth";
import roleMiddleware from "../middlewares/role";

export const router = express.Router();

// Registro de usuario (no requiere autenticación)
router.post("/register", validateSchema(userSchema), userController.register);

// Login de usuario (no requiere autenticación)
router.post("/login", userController.login);

// Crear usuario (requiere autenticación y rol de superadmin)
router.post("/", 
    authMiddleware, 
    roleMiddleware(['superadmin']),
    validateSchema(userSchema), 
    userController.create
);

// Obtener todos los usuarios (requiere autenticación)
router.get("/", authMiddleware, userController.getAll);

// Obtener un usuario específico por ID y grupo (requiere autenticación)
router.get("/:id/group/:groupId", authMiddleware, (req: Request, res: Response) => {
    res.send(`Get user with ID ${req.params.id} and group ID: ${req.params.groupId}`);
});

// Perfil del usuario autenticado (requiere autenticación)
// router.get("/profile", authMiddleware, userController.getUser);

// Obtener un usuario por ID (requiere autenticación)
router.get("/:id", authMiddleware, userController.getById);

// Actualizar usuario (requiere autenticación)
router.put("/:id", 
    authMiddleware, 
    validateSchema(userSchema), 
    userController.update
);

// Eliminar usuario (requiere autenticación y rol de superadmin)
router.delete("/:id", 
    authMiddleware, 
    roleMiddleware(['superadmin']), 
    userController.delete
);

export default router;
