import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, sanitizeS3PathSegment, uploadToS3 } from "../../../../shared/middleware/s3Uplosd";
import { ENV } from "../../../../shared/env/ENV";

const S3_FOLDER_NAME = "graduates details";

export class GraduateImageService {
  static async processAndUpload(
    file?: Express.Multer.File,
    base64OrUrl?: string,
    prefix: string = "graduate"
  ): Promise<string> {
    // 1. If Multer uploaded file is present
    if (file) {
      const { url } = await uploadToS3(file, S3_FOLDER_NAME);
      return url;
    }

    if (!base64OrUrl) return "";

    // 2. If already an HTTP/HTTPS URL and not a base64 Data URL, return as is
    if (!base64OrUrl.startsWith("data:image")) {
      return base64OrUrl;
    }

    // 3. Handle base64 Data URL and upload to S3 under "graduates details"
    const matches = base64OrUrl.match(/^data:(image\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
    if (!matches) return base64OrUrl;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    const extension = mimeType.split("/")[1] || "png";
    const fileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;
    const folderPath = sanitizeS3PathSegment(S3_FOLDER_NAME);
    const key = `${folderPath}/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: ENV.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    return `https://${ENV.AWS_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`;
  }
}
