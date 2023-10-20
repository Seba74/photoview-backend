import { Response, Request, Router } from "express";
import { validateJWT } from "../middlewares/user.auth";
import { Post } from "../models/post";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../config/file-system";

const postRoutes = Router();
const fileSystem = new FileSystem();

// Get Posts
postRoutes.get("/", async (req: any, res: Response) => {
  let page = Number(req.query.page) || 1;
  let skip = (page - 1) * 10;

  const posts = await Post.find()
    .sort({ _id: -1 })
    .limit(10)
    .skip(skip)
    .populate("user", "-password");

  res.json({
    ok: true,
    page,
    posts,
  });
});

// Create Posts
postRoutes.post("/create", validateJWT, (req: any, res: Response) => {
  const data = req.body;
  data.user = req.user._id;

  const images = fileSystem.imagesFromTempToPost(req.user._id);
  data.images = images;

  Post.create(data)
    .then(async (postDB) => {
      await postDB.populate("user", "-password");

      res.json({
        ok: true,
        post: postDB,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        err,
      });
    });
});

// Upload files
postRoutes.post("/upload", validateJWT, async (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: "No files were uploaded.",
    });
  }

  const file: FileUpload = req.files.image;
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

  await fileSystem.saveImageTemp(file, req.user._id);

  res.status(200).json({
    ok: true,
    file: file.mimetype,
  });
});

postRoutes.delete("/temp", validateJWT, async (req: any, res: Response) => {
  const userId = req.user._id;
  await fileSystem.delateTempImages(userId);

  res.json({
    ok: true,
    message: "Temp images deleted.",
  });
});

// Get image
postRoutes.get("/image/:userId/:img", (req: any, res: Response) => {
  const userId = req.params.userId;
  const img = req.params.img;

  const pathImg = fileSystem.getImgUrl(userId, img);
  if (!pathImg) {
    res.status(404).json({
      ok: false,
      message: "Image not found.",
    });
  } else {
    res.sendFile(pathImg);
  }
});

export default postRoutes;
