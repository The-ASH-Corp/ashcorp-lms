import { Request, RequestHandler } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../error/AppError";

const uploadDir = path.join(__dirname, "../../../../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const imageMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  if (!imageMimeTypes.includes(file.mimetype)) {
    return cb(new AppError("Only image files are allowed", 400));
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for local images
  },
  fileFilter,
});

export const localImageUpload = (fieldName: string): RequestHandler => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (error: unknown) => {
      if (error) {
        if (error instanceof multer.MulterError) {
          return next(new AppError(error.message, 400));
        }
        return next(error);
      }
      next();
    });
  };
};
