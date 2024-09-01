import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/users.Models";
import { notAuthorizedError, userNotFoundError, userExistError, commentNotFoundError, notCommentAuthorError, notReactionOwnerError, reactionNotFoundError  } from "../exceptions/index"; // Asegúrate de tener estas excepciones definidas

class UserService {
    public async create(userInput: UserDocument): Promise<UserDocument> {
        try {
            const existingUser = await this.findByEmail(userInput.email);
            if (existingUser) {
                throw new userExistError("El usuario ya existe");
            }

            userInput.password = await bcrypt.hash(userInput.password, 10);

            const user = await User.create(userInput);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async register(userInput: UserDocument): Promise<UserDocument> {
        try {            
            
            if (!userInput.role) {
                userInput.role = 'user'; 
            }
            return await this.create(userInput);
        } catch (error) {
            throw error;
        }
    }
    

    public async login(userInput: any) {
        try {
            console.log("Intentando iniciar sesión con:", userInput.email);
            
            const user = await this.findByEmail(userInput.email);
            if (!user) {
                console.log("Usuario no encontrado");
                throw new notAuthorizedError("Credenciales inválidas");
            }
    
            const isMatch = await bcrypt.compare(userInput.password, user.password);
            if (!isMatch) {
                console.log("Contraseña incorrecta");
                throw new notAuthorizedError("Credenciales inválidas");
            }
    
            console.log("Inicio de sesión exitoso para:", user.email);
    
            const token = this.generateToken(user);
            return {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            console.error("Error en el login:");
            throw error;
        }
    }
    
    

    public async getAll(): Promise<UserDocument[]> {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            throw error;
        }
    }

    public async getById(id: string): Promise<UserDocument | null> {
        try {
            const user = await User.findById(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async update(id: string, userInput: Partial<UserDocument>): Promise<UserDocument | null> {
        try {
            
            if (userInput.password) {
                userInput.password = await bcrypt.hash(userInput.password, 10);
            }

            const user = await User.findByIdAndUpdate(id, userInput, { new: true });
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<UserDocument | null> {
        try {
            const user = await User.findByIdAndDelete(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    private async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async getUserCount(): Promise<number> {
        try {
            return await User.countDocuments();
        } catch (error) {
            throw error;
        }
    }
    

    private generateToken(user: UserDocument): string {
        try {
   
            return jwt.sign({ user_id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "5m" }); 
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();