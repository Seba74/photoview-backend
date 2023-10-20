"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_config_1 = __importDefault(require("../jwt/jwt.config"));
const user_auth_1 = require("../middlewares/user.auth");
const userRoutes = (0, express_1.Router)();
// Login user
userRoutes.post("/login", (req, res) => {
    const { email, password } = req.body;
    user_1.User.findOne({ email }) // Find user by email
        .then((userDB) => {
        if (!userDB) {
            return res.json({
                ok: false,
                message: "Email or password incorrect",
            });
        }
        if (userDB.comparePassword(password)) {
            const tokenUser = jwt_config_1.default.getJwtToken({
                _id: userDB._id,
                username: userDB.username,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            res.json({
                ok: true,
                token: tokenUser,
            });
        }
        else {
            return res.json({
                ok: false,
                message: "Email or password incorrect",
            });
        }
    })
        .catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});
// Register a new user
userRoutes.post("/register", (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
    };
    user_1.User.create(user)
        .then((userDB) => {
        const tokenUser = jwt_config_1.default.getJwtToken({
            _id: userDB._id,
            username: userDB.username,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        res.json({
            ok: true,
            token: tokenUser,
        });
    })
        .catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});
// Get User
userRoutes.get("/", user_auth_1.validateJWT, (req, res) => {
    const user = req.user;
    res.json({
        ok: true,
        user,
    });
});
// Update user
userRoutes.put("/update", user_auth_1.validateJWT, (req, res) => {
    const user = {
        username: req.body.username || req.user.username,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar,
    };
    user_1.User.findByIdAndUpdate(req.user._id, user, { new: true })
        .then((userDB) => {
        if (!userDB)
            return res.json({
                ok: false,
                message: "User not found",
            });
        const tokenUser = jwt_config_1.default.getJwtToken({
            _id: userDB._id,
            username: userDB.username,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        res.json({
            ok: true,
            token: tokenUser,
        });
    })
        .catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});
exports.default = userRoutes;
