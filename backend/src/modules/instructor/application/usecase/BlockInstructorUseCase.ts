import { AppError } from "../../../../shared/error/AppError";
import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";

export class BlockInstructorUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(id: string): Promise<Instructor> {
    const instructor = await this.instructorRepository.findById(id);

    if (!instructor) {
      throw new AppError("Instructor not found", 404);
    }

    const nextStatus = instructor.status === "Inactive" ? "Active" : "Inactive";

    return await this.instructorRepository.updateStatus(id, nextStatus);
  }
}
