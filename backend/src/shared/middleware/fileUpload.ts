import { Request, RequestHandler } from "express";
import multer, { FileFilterCallback } from "multer";
import { AppError } from "../error/AppError";

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
  ];
  const documentMimeTypes = ["application/pdf"];
  const audioMimeTypes = [
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/webm",
    "audio/ogg",
    "audio/aac",
  ];
  const videoMimeTypes = [
    "video/mp4",
    "video/quicktime",
    "video/x-m4v",
    "video/x-msvideo",
    "video/x-matroska",
    "video/matroska",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mpeg",
    "video/3gpp",
    "video/3gpp2",
    "video/x-flv",
    "video/x-ms-wmv",
    "video/x-ms-asf",
    "video/x-msvideo",
    "video/x-matroska",
    "video/x-mpeg",
    "video/x-mpeg2",
    "video/x-mpeg4",
    "video/x-mpegurl",
    "video/x-ms-wm",
    "video/x-ms-wmv",
    "video/x-ms-asf",
  ];

  if (file.fieldname === "introVideo") {
    if (!videoMimeTypes.includes(file.mimetype)) {
      return cb(new AppError("Only video files are allowed for intro video", 400));
    }
  } else if (file.fieldname === "files") {
    const allowedAssetMimeTypes = [
      ...imageMimeTypes,
      ...videoMimeTypes,
      ...audioMimeTypes,
      ...documentMimeTypes,
    ];

    if (!allowedAssetMimeTypes.includes(file.mimetype)) {
      return cb(new AppError("Only image, video, audio, or PDF files are allowed", 400));
    }
  } else {
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(new AppError("Only image files are allowed", 400));
    }
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2048 * 1024 * 1024,
  },
  fileFilter,
});

export const fileUpload = (
  fields: { name: string; maxCount: number }[],
): RequestHandler => {
  return (req, res, next) => {
    upload.fields(fields)(req, res, (error: unknown) => {
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
