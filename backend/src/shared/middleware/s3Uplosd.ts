import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ENV } from "../env/ENV";
import path from "path";

export const s3 = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY,
    secretAccessKey: ENV.AWS_SECRET_KEY,
  },
});


export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string | string[],
) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const originalName = path.basename(file.originalname, extension);
  const fileName = `${sanitizeS3PathSegment(originalName)}${extension}`;
  const folderPath = Array.isArray(folder)
    ? folder.map(sanitizeS3PathSegment).filter(Boolean).join("/")
    : folder
        .split("/")
        .map(sanitizeS3PathSegment)
        .filter(Boolean)
        .join("/");
  const key = `${folderPath}/${fileName}`;


  await s3.send(
    new PutObjectCommand({
      Bucket: ENV.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return {
    key,
    url: `https://${ENV.AWS_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`,
  };
};

export const sanitizeS3PathSegment = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
