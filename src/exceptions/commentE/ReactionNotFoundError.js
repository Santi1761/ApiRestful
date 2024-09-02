"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReactionNotFoundError extends Error {
    constructor(message) {
        super('');
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.default = ReactionNotFoundError;
