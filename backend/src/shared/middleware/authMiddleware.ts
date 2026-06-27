import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../env/ENV";
import mongoose from "mongoose";

interface TokenPayload extends JwtPayload {
  userId?: string | mongoose.Types.ObjectId;
  id?: string | mongoose.Types.ObjectId;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : cookieToken;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    if (typeof decoded === "string") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const payload = decoded as TokenPayload;
    const userId = payload.userId ?? payload.id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.userId = userId;

    return next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
