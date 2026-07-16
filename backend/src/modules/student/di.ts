import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";
import { RegisterUsecase } from "../auth/application/usecase/RegisterUsecase";
import { GetAllStudentsUseCase } from "./application/usecase/GetAllStudentsUseCase";
import { DeleteStudentUseCase } from "./application/usecase/DeleteStudentUseCase";
import { BlockStudentUseCase } from "./application/usecase/BlockStudentUseCase";
import { AddToWishlistUseCase } from "./application/usecase/AddToWishlistUseCase";
import { RemoveFromWishlistUseCase } from "./application/usecase/RemoveFromWishlistUseCase";
import { GetWishlistUseCase } from "./application/usecase/GetWishlistUseCase";
import { EnrollCourseUseCase } from "./application/usecase/EnrollCourseUseCase";
import { courseRepository } from "../course/di";

export const studentUserRepository = new MongoUserRepository();

// Re-use register usecase to create a student (same flow as self-register)
export const createStudentUseCase = new RegisterUsecase(studentUserRepository);

// Get all students (users with role "user")
export const getAllStudentsUseCase = new GetAllStudentsUseCase(studentUserRepository);

// delete student usecase
export const deleteStudentUseCase = new DeleteStudentUseCase(studentUserRepository);

// block student usecase
export const blockStudentUseCase = new BlockStudentUseCase(studentUserRepository);

// add to wishlist usecase
export const addToWishlistUseCase = new AddToWishlistUseCase(studentUserRepository);

// remove from wishlist usecase
export const removeFromWishlistUseCase = new RemoveFromWishlistUseCase(studentUserRepository);

// get wishlist usecase
export const getWishlistUseCase = new GetWishlistUseCase(studentUserRepository,courseRepository);

// enroll course usecase
export const enrollCourseUseCase = new EnrollCourseUseCase(
  studentUserRepository,
  courseRepository,
);
