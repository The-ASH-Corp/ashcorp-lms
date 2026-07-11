import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";
import { RegisterUsecase } from "../auth/application/usecase/RegisterUsecase";
import { GetAllStudentsUseCase } from "./application/usecase/GetAllStudentsUseCase";

export const studentUserRepository = new MongoUserRepository();

// Re-use register usecase to create a student (same flow as self-register)
export const createStudentUseCase = new RegisterUsecase(studentUserRepository);

// Get all students (users with role "user")
export const getAllStudentsUseCase = new GetAllStudentsUseCase(studentUserRepository);
