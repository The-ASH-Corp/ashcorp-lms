import { CreateCourseUseCase } from "./application/usecase/CreateCourseUseCase";
import { GetAllCourseUseCase } from "./application/usecase/GetAllCourseUseCase";
import { MongoCourseRepository } from "./infrastructure/repositories/MongoCourseRepository";

export const courseRepository = new MongoCourseRepository();

// course find all usecase 
export const courseFindAllUseCase = new GetAllCourseUseCase(courseRepository);

// course create usecase 
export const createCourseUseCase = new CreateCourseUseCase(courseRepository);