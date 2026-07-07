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

const uploadRoot = path.join(__dirname, "../../../uploads");
const imageUploadDir = path.join(uploadRoot, "images");
const videoUploadDir = path.join(uploadRoot, "videos");

fs.mkdirSync(imageUploadDir, { recursive: true });
fs.mkdirSync(videoUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    file: UploadedFile,
    cb: (error: Error | null, destination: string) => void,
  ): void => {
    if (file.fieldname === "introVideo") {
      cb(null, videoUploadDir);
    } else {
      cb(null, imageUploadDir);
    }
  },
  filename: (
    _req: Request,
    file: UploadedFile,
    cb: (error: Error | null, filename: string) => void,
  ): void => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  },
});

const fileFilter = (
  _req: Request,
  file: UploadedFile,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const imageMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
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

  if (file.fieldname == "introVideo") {
    console.log("File mimetype:", file.mimetype);
    if (!videoMimeTypes.includes(file.mimetype)) {
      return cb(new AppError("Only video files are allowed for intro video", 400), false);
    }
  } else {
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(new AppError("Only image files are allowed", 400), false);
    }
  }

  cb(null, true);
};

const upload = multer({
  storage,
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
