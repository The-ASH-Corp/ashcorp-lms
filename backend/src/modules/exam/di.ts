import { MongoExamRepository } from "./infrastructure/repositories/MongoExamRepository";
import { CreateExamUseCase } from "./application/usecase/CreateExamUseCase";
import { GetExamByCourseUseCase } from "./application/usecase/GetExamByCourseUseCase";
import { DeleteExamUseCase } from "./application/usecase/DeleteExamUseCase";

export const examRepository = new MongoExamRepository();

export const createExamUseCase = new CreateExamUseCase(examRepository);

export const getExamByCourseUseCase = new GetExamByCourseUseCase(examRepository);

export const deleteExamUseCase = new DeleteExamUseCase(examRepository);
