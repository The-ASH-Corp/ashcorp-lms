import { CreateCourseUseCase } from "./application/usecase/CreateCourseUseCase";
import { DeleteCourseUseCase } from "./application/usecase/DeleteCourseUseCase";
import { GetAllCourseUseCase } from "./application/usecase/GetAllCourseUseCase";
import { MongoCourseRepository } from "./infrastructure/repositories/MongoCourseRepository";
import { categoryRepository } from "../category/di";
import { instructorRepository } from "../instructor/di";
import { GetCourseByIdUseCase } from "./application/usecase/GetCourseByIdUseCase";

export const courseRepository = new MongoCourseRepository();

// course find all useCase
export const courseFindAllUseCase = new GetAllCourseUseCase(courseRepository);

// course create useCase
export const createCourseUseCase = new CreateCourseUseCase(
  courseRepository,
  categoryRepository,
  instructorRepository,
);

// course find by id useCase
export const getCourseByIdUseCase = new GetCourseByIdUseCase(courseRepository);

// course delete usecase
export const deleteCourseUseCase = new DeleteCourseUseCase(courseRepository);