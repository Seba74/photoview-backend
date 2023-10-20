"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },
    avatar: {
        type: String,
        default: "https://ionicframework.com/docs/img/demos/avatar.svg",
    },
    createdAt: {
        type: String,
        default: new Date().toISOString(),
    },
    updatedAt: {
        type: String,
        default: new Date().toISOString(),
    },
});
userSchema.method("comparePassword", function (password = "") {
    return (bcryptjs_1.default.compareSync(password, this.password));
});
exports.User = (0, mongoose_1.model)("User", userSchema);
