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
const users_Services_1 = __importDefault(require("../services/users.Services"));
const index_1 = require("../exceptions/index"); // Asegúrate de tener estas excepciones definidas
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userCount = yield users_Services_1.default.getUserCount();
                if (userCount === 0) {
                    req.body.role = 'superadmin';
                }
                else if (req.body.role === 'superadmin') {
                    if (req.body.loggedUser.role !== 'superadmin') {
                        return res.status(403).json({ message: "No tienes permiso para crear un superadmin" });
                    }
                }
                const user = yield users_Services_1.default.create(req.body);
                return res.status(201).json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_Services_1.default.register(req.body);
                return res.status(201).json(user);
            }
            catch (error) {
                if (error instanceof index_1.userExistError) {
                    return res.status(400).json({ message: error.message });
                }
                console.error(error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userObj = yield users_Services_1.default.login(req.body);
                return res.status(200).json(userObj);
            }
            catch (error) {
                if (error instanceof index_1.notAuthorizedError) {
                    return res.status(401).json({ message: error.message });
                }
                console.error(error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIdToUpdate = req.params.id;
                if (req.body.loggedUser.role !== 'superadmin' && req.body.loggedUser.user_id !== userIdToUpdate) {
                    return res.status(403).json({ message: 'No tienes permiso para actualizar este usuario' });
                }
                const updatedUser = yield users_Services_1.default.update(userIdToUpdate, req.body);
                if (!updatedUser) {
                    return res.status(404).json({ message: `Usuario con ID ${userIdToUpdate} no encontrado` });
                }
                return res.json(updatedUser);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIdToGet = req.params.id;
                if (req.body.loggedUser.role !== 'superadmin' && req.body.loggedUser.user_id !== userIdToGet) {
                    return res.status(403).json({ message: 'No tienes permiso para ver este usuario' });
                }
                const user = yield users_Services_1.default.getById(userIdToGet);
                if (!user) {
                    return res.status(404).json({ message: `Usuario con ID ${userIdToGet} no encontrado` });
                }
                return res.json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield users_Services_1.default.getAll();
                return res.json(users);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIdToDelete = req.params.id;
                const deletedUser = yield users_Services_1.default.delete(userIdToDelete);
                if (!deletedUser) {
                    return res.status(404).json({ message: `Usuario con ID ${userIdToDelete} no encontrado` });
                }
                return res.json(deletedUser);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
}
exports.default = new UserController();
