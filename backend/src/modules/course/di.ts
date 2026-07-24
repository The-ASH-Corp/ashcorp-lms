import { CreateCourseUseCase } from "./application/usecase/CreateCourseUseCase";
import { DeleteCourseUseCase } from "./application/usecase/DeleteCourseUseCase";
import { GetAllCourseUseCase } from "./application/usecase/GetAllCourseUseCase";
import { MongoCourseRepository } from "./infrastructure/repositories/MongoCourseRepository";
import { categoryRepository } from "../category/di";
import { instructorRepository } from "../instructor/di";
import { userRepository } from "../auth/di";
import { GetCourseByIdUseCase } from "./application/usecase/GetCourseByIdUseCase";
import { MakeCourseFreeAndPublishedUseCase } from "./application/usecase/MakeCourseFreeAndPublishedUseCase";
import { AddReviewUseCase } from "./application/usecase/AddReviewUseCase";
import { UpdateCourseUseCase } from "./application/usecase/UpdateCourseUseCase";

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

// course delete useCase
export const deleteCourseUseCase = new DeleteCourseUseCase(
  courseRepository,
  userRepository,
);

// course make free and publish useCase
export const makeCourseFreeAndPublishedUseCase =
  new MakeCourseFreeAndPublishedUseCase(courseRepository);

// add review useCase
export const addReviewUseCase = new AddReviewUseCase(courseRepository);

// course update useCase
export const updateCourseUseCase = new UpdateCourseUseCase(
  courseRepository,
  categoryRepository,
  instructorRepository,
);
