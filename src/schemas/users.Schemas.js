"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userSchema = (0, zod_1.object)({
    username: (0, zod_1.string)({ required_error: "El nombre de usuario es requerido" })
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: (0, zod_1.string)({ required_error: "El correo electrónico es requerido" })
        .email("No es una dirección de correo electrónico válida"),
    password: (0, zod_1.string)({ required_error: "La contraseña es requerida" })
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: zod_1.z.enum(['superadmin', 'user'], { required_error: "El rol es requerido" })
});
exports.default = userSchema;
