import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Handle generic / unexpected error
  console.error("Unhandled error:", err);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};
