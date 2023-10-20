import { Response, Request, Router } from "express";
import { IUser, User } from "../models/user";
import bcrypt from "bcrypt";
import Token from "../jwt/jwt.config";
import { validateJWT } from "../middlewares/user.auth";

const userRoutes = Router();

// Login user
userRoutes.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  User.findOne({ email }) // Find user by email
    .then((userDB: IUser | null) => {
      if (!userDB) {
        return res.json({
          ok: false,
          message: "Email or password incorrect",
        });
      }

      if (userDB.comparePassword(password)) {
        const tokenUser = Token.getJwtToken({
          _id: userDB._id,
          username: userDB.username,
          email: userDB.email,
          avatar: userDB.avatar,
        });

        res.json({
          ok: true,
          token: tokenUser,
        });
      } else {
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
userRoutes.post("/register", (req: Request, res: Response) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar,
  };

  User.create(user)
    .then((userDB: IUser) => {
      const tokenUser = Token.getJwtToken({
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
userRoutes.get("/", validateJWT, (req: any, res: Response) => {
  const user = req.user;
  res.json({
    ok: true,
    user,
  });
});

// Update user
userRoutes.put("/update", validateJWT, (req: any, res: Response) => {
  const user = {
    username: req.body.username || req.user.username,
    email: req.body.email || req.user.email,
    avatar: req.body.avatar || req.user.avatar,
  };

  User.findByIdAndUpdate(req.user._id, user, { new: true })
    .then((userDB: any) => {
      if (!userDB)
        return res.json({
          ok: false,
          message: "User not found",
        });

      const tokenUser = Token.getJwtToken({
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

export default userRoutes;
