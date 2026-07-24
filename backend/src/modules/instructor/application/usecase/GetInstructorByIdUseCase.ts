import { InstructorRepository } from "../../domain/repositories/InstructorRepository";
import { Instructor } from "../../domain/entities/Instructor";
import { AppError } from "../../../../shared/error/AppError";

export class GetInstructorByIdUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(id: string): Promise<Instructor> {
    const instructor = await this.instructorRepository.findById(id);

    if (!instructor) {
      throw new AppError("Instructor not found", 404);
    }

    return instructor;
  }
}
