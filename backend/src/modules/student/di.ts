import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";
import { RegisterUsecase } from "../auth/application/usecase/RegisterUsecase";
import { GetAllStudentsUseCase } from "./application/usecase/GetAllStudentsUseCase";
import { DeleteStudentUseCase } from "./application/usecase/DeleteStudentUseCase";
import { BlockStudentUseCase } from "./application/usecase/BlockStudentUseCase";

export const studentUserRepository = new MongoUserRepository();

// Re-use register usecase to create a student (same flow as self-register)
export const createStudentUseCase = new RegisterUsecase(studentUserRepository);

// Get all students (users with role "user")
export const getAllStudentsUseCase = new GetAllStudentsUseCase(studentUserRepository);

// delete student usecase
export const deleteStudentUseCase = new DeleteStudentUseCase(studentUserRepository);

// block student usecase
export const blockStudentUseCase = new BlockStudentUseCase(studentUserRepository);
