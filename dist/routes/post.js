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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_auth_1 = require("../middlewares/user.auth");
const post_1 = require("../models/post");
const file_system_1 = __importDefault(require("../config/file-system"));
const postRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
// Get Posts
postRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let skip = (page - 1) * 10;
    const posts = yield post_1.Post.find()
        .sort({ _id: -1 })
        .limit(10)
        .skip(skip)
        .populate("user", "-password");
    res.json({
        ok: true,
        page,
        posts,
    });
}));
// Create Posts
postRoutes.post("/create", user_auth_1.validateJWT, (req, res) => {
    const data = req.body;
    data.user = req.user._id;
    const images = fileSystem.imagesFromTempToPost(req.user._id);
    data.images = images;
    post_1.Post.create(data)
        .then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate("user", "-password");
        res.json({
            ok: true,
            post: postDB,
        });
    }))
        .catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});
// Upload files
postRoutes.post("/upload", user_auth_1.validateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "No files were uploaded.",
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            message: "No image was uploaded.",
        });
    }
    if (!file.mimetype.includes("image")) {
        return res.status(400).json({
            ok: false,
            message: "Uploaded file is not an image.",
        });
    }
    yield fileSystem.saveImageTemp(file, req.user._id);
    res.status(200).json({
        ok: true,
        file: file.mimetype,
    });
}));
postRoutes.delete("/temp", user_auth_1.validateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    yield fileSystem.delateTempImages(userId);
    res.json({
        ok: true,
        message: "Temp images deleted.",
    });
}));
// Get image
postRoutes.get("/image/:userId/:img", (req, res) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const pathImg = fileSystem.getImgUrl(userId, img);
    if (!pathImg) {
        res.status(404).json({
            ok: false,
            message: "Image not found.",
        });
    }
    else {
        res.sendFile(pathImg);
    }
});
exports.default = postRoutes;
