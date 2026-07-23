import { AppError } from "../../../../shared/error/AppError";
import { Graduate, GraduateResponseDTO } from "../../domain/entities/Graduate";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";

export class UpdateGraduateUseCase {
  constructor(private readonly graduateRepository: GraduateRepository) {}

  async execute(id: string, data: Partial<Graduate>): Promise<GraduateResponseDTO> {
    const updated = await this.graduateRepository.update(id, data);
    if (!updated) {
      throw new AppError("Graduate not found", 404);
    }
    return updated;
  }
}
