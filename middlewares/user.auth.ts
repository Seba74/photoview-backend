import { Request, Response, NextFunction } from "express";
import Token from "../jwt/jwt.config";

export const validateJWT = (req: any, res: Response, next: NextFunction) => {
    
  const token = req.header("user-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "No token in the request",
    });
  }

  Token.checkToken(token)
    .then((decoded: any) => {
      req.user = decoded.user;
      next();
    })
    .catch((err: any) => {
      res.status(401).json({
        ok: false,
        message: "Invalid token",
      });
    });
};
