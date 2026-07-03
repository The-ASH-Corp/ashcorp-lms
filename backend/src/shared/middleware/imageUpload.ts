import { Request, RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../error/AppError";

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

const uploadDirectory = path.join(__dirname, "../../../uploads/images");
fs.mkdirSync(uploadDirectory, { recursive: true });

const imageFileFilter = (
  _req: Request,
  file: UploadedFile,
  cb: (error: Error | null, acceptFile: boolean) => void
): void => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new AppError("Only image files are allowed", 400));
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: UploadedFile,
    cb: (error: Error | null, destination: string) => void
  ): void => {
    cb(null, uploadDirectory);
  },
  filename: (
    _req: Request,
    file: UploadedFile,
    cb: (error: Error | null, filename: string) => void
  ): void => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageFileFilter,
});

export const imageUpload = (fieldName = "image"): RequestHandler => {
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
