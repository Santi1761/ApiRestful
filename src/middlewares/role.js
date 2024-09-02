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
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userRole = (_a = req.body.loggedUser) === null || _a === void 0 ? void 0 : _a.role;
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
    });
};
exports.default = roleMiddleware;
