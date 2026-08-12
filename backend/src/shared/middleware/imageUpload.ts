import { Request, RequestHandler } from "express";
import multer, { FileFilterCallback } from "multer";
import { AppError } from "../error/AppError";

const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new AppError("Only image files are allowed", 400));
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
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

export const graduateImagesUpload = (): RequestHandler => {
  return (req, res, next) => {
    upload.fields([
      { name: "image", maxCount: 1 },
    ])(req, res, (error: unknown) => {
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
