import { Request, RequestHandler } from "express";
import multer, { FileFilterCallback } from "multer";
import { AppError } from "../error/AppError";

const certificateFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new AppError(
        "Only PDF, PNG, or JPEG/JPG files are allowed for certificates",
        400,
      ),
    );
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: certificateFileFilter,
});

export const certificateUpload = (): RequestHandler => {
  return (req, res, next) => {
    upload.fields([
      { name: "file", maxCount: 1 },
      { name: "certificate", maxCount: 1 },
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
