import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";

export class FindInstructorByEmailUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(email: string): Promise<Instructor | null> {
    return await this.instructorRepository.findByEmail(email);
  }
  
}
