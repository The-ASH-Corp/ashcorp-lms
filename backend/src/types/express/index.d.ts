import "express";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId?: string | mongoose.Types.ObjectId;
    }
  }
}

export {};