import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";

export class GetAllInstructorsUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(options?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }): Promise<Instructor[] | { instructors: any[]; totalInstructors: number }> {
    if (
      options?.page !== undefined &&
      options?.limit !== undefined &&
      options.page > 0 &&
      options.limit > 0
    ) {
      return await this.instructorRepository.getPaginatedInstructors(
        options.page,
        options.limit,
        options.searchTerm,
      );
    }

    return await this.instructorRepository.findAll();
  }
}