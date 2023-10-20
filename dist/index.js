"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Server initialization
const server_1 = __importDefault(require("./server/server"));
// Database connection
const db_1 = require("./database/db");
// Middlewares
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// Cors config
const cors_1 = __importDefault(require("cors"));
// Routes
const user_1 = __importDefault(require("./routes/user"));
const post_1 = __importDefault(require("./routes/post"));
const server = new server_1.default();
// Middlewares
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
server.app.use((0, express_fileupload_1.default)());
// Cors config
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
// Routes
server.app.use("/user", user_1.default);
server.app.use("/posts", post_1.default);
// Connect to DB
(0, db_1.connect)();
server.start(() => {
    console.log(`Server running on port ${server.port}`);
});
