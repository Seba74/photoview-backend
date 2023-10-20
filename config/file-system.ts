import { FileUpload } from "../interfaces/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystem {
  constructor() {}

  saveImageTemp(file: FileUpload, userId: string) {
    return new Promise<void>((resolve, reject) => {
      const path = this.createUserPath(userId);
      const fileName = this.generateUniqueName(file.name);

      file.mv(`${path}/${fileName}`, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  delateTempImages(userId: string) {
    return new Promise<void>((resolve, reject) => {
      const pathTemp = path.resolve(__dirname, "../uploads/", userId, "temp");
      if (fs.existsSync(pathTemp)) {
        fs.readdirSync(pathTemp).forEach((file) => {
          fs.unlinkSync(`${pathTemp}/${file}`);
        });
        resolve();
      } else {
        resolve();
      }
    });
  }

  private createUserPath(userId: string) {
    const pathUser = path.resolve(__dirname, "../uploads/", userId);
    const pathUserTemp = pathUser + "/temp";

    if (!fs.existsSync(pathUser)) {
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathUserTemp);
    }

    return pathUserTemp;
  }

  private generateUniqueName(fileName: string) {
    const ext = fileName.split(".").pop();
    const uniqueId = uniqid();
    return `${uniqueId}.${ext}`;
  }

  imagesFromTempToPost(userId: string) {
    const pathUser = path.resolve(__dirname, "../uploads/", userId, "temp");
    const pathPost = path.resolve(__dirname, "../uploads/", userId, "posts");

    if (!fs.existsSync(pathUser)) {
      return [];
    }

    if (!fs.existsSync(pathPost)) {
      fs.mkdirSync(pathPost);
    }

    const imagesTemp = this.getImagesFromTemp(userId);

    imagesTemp.forEach((image) => {
      fs.renameSync(`${pathUser}/${image}`, `${pathPost}/${image}`);
    });

    return imagesTemp;
  }

  private getImagesFromTemp(userId: string) {
    const pathUser = path.resolve(__dirname, "../uploads/", userId, "temp");
    return fs.readdirSync(pathUser) || [];
  }

  getImgUrl(userId: string, imgName: string){

    const pathImg = path.resolve(__dirname, '../uploads', userId, 'posts', imgName);
    if(!fs.existsSync(pathImg)){
      return;
    }

    return pathImg;
  }
}
