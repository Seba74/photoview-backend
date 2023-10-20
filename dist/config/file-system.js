"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveImageTemp(file, userId) {
        return new Promise((resolve, reject) => {
            const path = this.createUserPath(userId);
            const fileName = this.generateUniqueName(file.name);
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    delateTempImages(userId) {
        return new Promise((resolve, reject) => {
            const pathTemp = path_1.default.resolve(__dirname, "../uploads/", userId, "temp");
            if (fs_1.default.existsSync(pathTemp)) {
                fs_1.default.readdirSync(pathTemp).forEach((file) => {
                    fs_1.default.unlinkSync(`${pathTemp}/${file}`);
                });
                resolve();
            }
            else {
                resolve();
            }
        });
    }
    createUserPath(userId) {
        const pathUser = path_1.default.resolve(__dirname, "../uploads/", userId);
        const pathUserTemp = pathUser + "/temp";
        if (!fs_1.default.existsSync(pathUser)) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    generateUniqueName(fileName) {
        const ext = fileName.split(".").pop();
        const uniqueId = (0, uniqid_1.default)();
        return `${uniqueId}.${ext}`;
    }
    imagesFromTempToPost(userId) {
        const pathUser = path_1.default.resolve(__dirname, "../uploads/", userId, "temp");
        const pathPost = path_1.default.resolve(__dirname, "../uploads/", userId, "posts");
        if (!fs_1.default.existsSync(pathUser)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagesTemp = this.getImagesFromTemp(userId);
        imagesTemp.forEach((image) => {
            fs_1.default.renameSync(`${pathUser}/${image}`, `${pathPost}/${image}`);
        });
        return imagesTemp;
    }
    getImagesFromTemp(userId) {
        const pathUser = path_1.default.resolve(__dirname, "../uploads/", userId, "temp");
        return fs_1.default.readdirSync(pathUser) || [];
    }
    getImgUrl(userId, imgName) {
        const pathImg = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', imgName);
        if (!fs_1.default.existsSync(pathImg)) {
            return;
        }
        return pathImg;
    }
}
exports.default = FileSystem;
