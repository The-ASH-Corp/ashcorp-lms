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
  folder: string,
) => {
  const extension = path.extname(file.originalname);

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}${extension}`;

  const key = `${folder}/${fileName}`;

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