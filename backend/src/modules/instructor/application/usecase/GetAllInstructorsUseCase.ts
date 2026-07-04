import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";

export class GetAllInstructorsUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(): Promise<Instructor[]> {
    return await this.instructorRepository.findAll();
  }
  
}