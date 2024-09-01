"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_Routes_1 = __importDefault(require("./routes/users.Routes"));
const db_1 = require("./configs/db");
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/users', users_Routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello, mundo!');
});
db_1.db.then(() => app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}));
