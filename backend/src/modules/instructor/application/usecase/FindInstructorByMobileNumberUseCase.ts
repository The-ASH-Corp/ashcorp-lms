import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";

export class FindInstructorByMobileNumberUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(mobileNumber: string): Promise<Instructor | null> {
    return await this.instructorRepository.findByMobileNumber(mobileNumber);
  }
  
}