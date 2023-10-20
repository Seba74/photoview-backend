"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect = () => {
    mongoose_1.default.connect(`mongodb://mongo:R5C9hcksw3L4AwVbArxa@containers-us-west-154.railway.app:6686`);
    mongoose_1.default.connection.once("open", () => {
        console.log("Connected to MongoDB");
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.log(err);
        process.exit(0);
    });
};
exports.connect = connect;
