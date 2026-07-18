import { MongoExamRepository } from "./infrastructure/repositories/MongoExamRepository";
import { CreateExamUseCase } from "./application/usecase/CreateExamUseCase";

export const examRepository = new MongoExamRepository();

export const createExamUseCase = new CreateExamUseCase(examRepository);
