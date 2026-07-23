import { AppError } from "../../../../shared/error/AppError";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";

export class DeleteGraduateUseCase {
  constructor(private readonly graduateRepository: GraduateRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.graduateRepository.delete(id);
    if (!deleted) {
      throw new AppError("Graduate not found", 404);
    }
  }
}
