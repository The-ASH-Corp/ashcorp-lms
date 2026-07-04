import { CreateInstructorUseCase } from "./application/usecase/CreateInstructorUseCase";
import { FindInstructorByEmailUseCase } from "./application/usecase/FindInstructorByEmailUseCase";
import { FindInstructorByMobileNumberUseCase } from "./application/usecase/FindInstructorByMobileNumberUseCase";
import { GetAllInstructorsUseCase } from "./application/usecase/GetAllInstructorsUseCase";
import { MongoInstructorRepository } from "./infrastructure/repositories/MongoInstructorRepository";

export const instructorRepository = new MongoInstructorRepository();

// create instructor usecase
export const createInstructorUseCase = new CreateInstructorUseCase(instructorRepository);

// find instructor by email usecase
export const findInstructorByEmailUseCase = new FindInstructorByEmailUseCase(instructorRepository);

// find instructor by mobile number usecase
export const findInstructorByMobileNumberUseCase = new FindInstructorByMobileNumberUseCase(instructorRepository);

// get all instructors usecase
export const getAllInstructorsUseCase = new GetAllInstructorsUseCase(instructorRepository);