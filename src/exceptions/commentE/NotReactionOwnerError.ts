export default class NotReactionOwnerError extends Error {
    constructor(message: string) {
        super('');
        this.name = this.constructor.name;
        this.message = message; 
    }
}