import { GetAllCourseUseCase } from "./application/usecase/GetAllCourseUseCase";
import { MongoCourseRepository } from "./infrastructure/repositories/MongoCourseRepository";

export const courseRepository = new MongoCourseRepository();

// course find all usecase 
export const courseFindAllUseCase = new GetAllCourseUseCase(courseRepository);