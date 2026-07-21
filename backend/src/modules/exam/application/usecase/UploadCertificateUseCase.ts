import path from "path";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { AppError } from "../../../../shared/error/AppError";
import { uploadToS3 } from "../../../../shared/middleware/s3Uplosd";
import { UserModel } from "../../../users/infrastructure/models/UserModel";

export interface UploadCertificateDTO {
  studentId: string;
  courseId: string;
  file: Express.Multer.File;
}

export class UploadCertificateUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ studentId, courseId, file }: UploadCertificateDTO) {
    if (!file) {
      throw new AppError("Certificate file (PDF, PNG, JPEG) is required", 400);
    }

    if (!studentId) {
      throw new AppError("studentId is required", 400);
    }

    if (!courseId) {
      throw new AppError("courseId is required", 400);
    }

    const student = await this.userRepository.findById(studentId);
    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const sanitizedStudentName = student.name.trim().replace(/\s+/g, "_");
    const extension = path.extname(file.originalname).toLowerCase() || ".pdf";
    const customFileName = `${sanitizedStudentName}_${dateStr}${extension}`;

    // Override file originalname so S3 upload uses student name and date
    file.originalname = customFileName;

    const uploadResult = await uploadToS3(file, "certificate");

    // Remove any existing certificate entry for this courseId, then push new object
    await UserModel.findByIdAndUpdate(studentId, {
      $pull: { certificates: { courseId } },
    });

    await UserModel.findByIdAndUpdate(studentId, {
      $push: {
        certificates: {
          courseId,
          link: uploadResult.url,
        },
      },
    });

    return {
      courseId,
      link: uploadResult.url,
      key: uploadResult.key,
    };
  }
}
