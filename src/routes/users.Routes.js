"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const users_Controllers_1 = __importDefault(require("../controllers/users.Controllers"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const users_Schemas_1 = __importDefault(require("../schemas/users.Schemas"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const role_1 = __importDefault(require("../middlewares/role"));
exports.router = express_1.default.Router();
// Registro de usuario (no requiere autenticación)
exports.router.post("/register", (0, validate_1.default)(users_Schemas_1.default), users_Controllers_1.default.register);
// Login de usuario (no requiere autenticación)
exports.router.post("/login", users_Controllers_1.default.login);
// Crear usuario (requiere autenticación y rol de superadmin)
exports.router.post("/", auth_1.default, (0, role_1.default)(['superadmin']), (0, validate_1.default)(users_Schemas_1.default), users_Controllers_1.default.create);
// Obtener todos los usuarios (requiere autenticación)
exports.router.get("/", auth_1.default, users_Controllers_1.default.getAll);
// Obtener un usuario específico por ID y grupo (requiere autenticación)
exports.router.get("/:id/group/:groupId", auth_1.default, (req, res) => {
    res.send(`Get user with ID ${req.params.id} and group ID: ${req.params.groupId}`);
});
// Perfil del usuario autenticado (requiere autenticación)
// router.get("/profile", authMiddleware, userController.getUser);
// Obtener un usuario por ID (requiere autenticación)
exports.router.get("/:id", auth_1.default, users_Controllers_1.default.getById);
// Actualizar usuario (requiere autenticación)
exports.router.put("/:id", auth_1.default, (0, validate_1.default)(users_Schemas_1.default), users_Controllers_1.default.update);
// Eliminar usuario (requiere autenticación y rol de superadmin)
exports.router.delete("/:id", auth_1.default, (0, role_1.default)(['superadmin']), users_Controllers_1.default.delete);
exports.default = exports.router;
