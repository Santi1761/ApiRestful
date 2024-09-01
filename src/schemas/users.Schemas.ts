import { object, string, z } from 'zod';

const userSchema = object({
    username: string({ required_error: "El nombre de usuario es requerido" })
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres"), 
    email: string({ required_error: "El correo electrónico es requerido" })
        .email("No es una dirección de correo electrónico válida"),
    password: string({ required_error: "La contraseña es requerida" })
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: z.enum(['superadmin', 'user'], { required_error: "El rol es requerido" }) 
});

export default userSchema;