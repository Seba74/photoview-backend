"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jwt_config_1 = __importDefault(require("../jwt/jwt.config"));
const validateJWT = (req, res, next) => {
    const token = req.header("user-token");
    if (!token) {
        return res.status(401).json({
            ok: false,
            message: "No token in the request",
        });
    }
    jwt_config_1.default.checkToken(token)
        .then((decoded) => {
        req.user = decoded.user;
        next();
    })
        .catch((err) => {
        res.status(401).json({
            ok: false,
            message: "Invalid token",
        });
    });
};
exports.validateJWT = validateJWT;
