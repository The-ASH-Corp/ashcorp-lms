import { MongoExamRepository } from "./infrastructure/repositories/MongoExamRepository";
import { CreateExamUseCase } from "./application/usecase/CreateExamUseCase";
import { GetExamByCourseUseCase } from "./application/usecase/GetExamByCourseUseCase";
import { DeleteExamUseCase } from "./application/usecase/DeleteExamUseCase";
import { UpdateExamUseCase } from "./application/usecase/UpdateExamUseCase";
import { UploadCertificateUseCase } from "./application/usecase/UploadCertificateUseCase";
import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";

export const examRepository = new MongoExamRepository();
const userRepository = new MongoUserRepository();

export const createExamUseCase = new CreateExamUseCase(examRepository);

export const getExamByCourseUseCase = new GetExamByCourseUseCase(examRepository);

export const deleteExamUseCase = new DeleteExamUseCase(examRepository);

export const updateExamUseCase = new UpdateExamUseCase(examRepository);

export const uploadCertificateUseCase = new UploadCertificateUseCase(userRepository);
