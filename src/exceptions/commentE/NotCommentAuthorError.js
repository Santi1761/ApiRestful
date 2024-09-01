"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotCommentAuthorError extends Error {
    constructor(message) {
        super('');
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.default = NotCommentAuthorError;
