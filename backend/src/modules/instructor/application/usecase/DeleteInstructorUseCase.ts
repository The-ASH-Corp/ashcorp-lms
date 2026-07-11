import { AppError } from "../../../../shared/error/AppError";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";

export class DeleteInstructorUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(id: string): Promise<void> {
    const instructor = await this.instructorRepository.findById(id);

    if (!instructor) {
      throw new AppError("Instructor not found", 404);
    }

    await this.instructorRepository.deleteInstructor(id);
  }
}
