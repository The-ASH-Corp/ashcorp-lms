import { CreateInstructorUseCase } from "./application/usecase/CreateInstructorUseCase";
import { FindInstructorByEmailUseCase } from "./application/usecase/FindInstructorByEmailUseCase";
import { FindInstructorByMobileNumberUseCase } from "./application/usecase/FindInstructorByMobileNumberUseCase";
import { DeleteInstructorUseCase } from "./application/usecase/DeleteInstructorUseCase";
import { GetAllInstructorsUseCase } from "./application/usecase/GetAllInstructorsUseCase";
import { BlockInstructorUseCase } from "./application/usecase/BlockInstructorUseCase";
import { GetInstructorByIdUseCase } from "./application/usecase/GetInstructorByIdUseCase";
import { UpdateInstructorUseCase } from "./application/usecase/UpdateInstructorUseCase";
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

// delete instructor usecase
export const deleteInstructorUseCase = new DeleteInstructorUseCase(instructorRepository);

// block instructor usecase
export const blockInstructorUseCase = new BlockInstructorUseCase(instructorRepository);

// get instructor by id usecase
export const getInstructorByIdUseCase = new GetInstructorByIdUseCase(instructorRepository);

// update instructor usecase
export const updateInstructorUseCase = new UpdateInstructorUseCase(instructorRepository);
