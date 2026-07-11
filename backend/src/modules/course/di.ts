import { CreateCourseUseCase } from "./application/usecase/CreateCourseUseCase";
import { DeleteCourseUseCase } from "./application/usecase/DeleteCourseUseCase";
import { GetAllCourseUseCase } from "./application/usecase/GetAllCourseUseCase";
import { MongoCourseRepository } from "./infrastructure/repositories/MongoCourseRepository";
import { categoryRepository } from "../category/di";
import { instructorRepository } from "../instructor/di";

export const courseRepository = new MongoCourseRepository();

// course find all usecase 
export const courseFindAllUseCase = new GetAllCourseUseCase(courseRepository);

// course create usecase 
export const createCourseUseCase = new CreateCourseUseCase(
  courseRepository,
  categoryRepository,
  instructorRepository,
);

// course delete usecase
export const deleteCourseUseCase = new DeleteCourseUseCase(courseRepository);
