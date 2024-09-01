"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_Models_1 = __importDefault(require("../models/users.Models"));
const index_1 = require("../exceptions/index"); // Asegúrate de tener estas excepciones definidas
class UserService {
    create(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.findByEmail(userInput.email);
                if (existingUser) {
                    throw new index_1.userExistError("El usuario ya existe");
                }
                userInput.password = yield bcrypt_1.default.hash(userInput.password, 10);
                const user = yield users_Models_1.default.create(userInput);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    register(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                userInput.role = 'user';
                return yield this.create(userInput);
            }
            catch (error) {
                throw error;
            }
        });
    }
    login(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.findByEmail(userInput.email);
                if (!user) {
                    throw new index_1.notAuthorizedError("Credenciales inválidas");
                }
                const isMatch = yield bcrypt_1.default.compare(userInput.password, user.password);
                if (!isMatch) {
                    throw new index_1.notAuthorizedError("Credenciales inválidas");
                }
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield users_Models_1.default.find();
                return users;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_Models_1.default.findById(id);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userInput.password) {
                    userInput.password = yield bcrypt_1.default.hash(userInput.password, 10);
                }
                const user = yield users_Models_1.default.findByIdAndUpdate(id, userInput, { new: true });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_Models_1.default.findByIdAndDelete(id);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_Models_1.default.findOne({ email });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield users_Models_1.default.countDocuments();
            }
            catch (error) {
                throw error;
            }
        });
    }
    generateToken(user) {
        try {
            return jsonwebtoken_1.default.sign({ user_id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "5m" });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = new UserService();
