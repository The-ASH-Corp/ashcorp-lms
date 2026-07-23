import { AppError } from "../../../../shared/error/AppError";
import { GraduateResponseDTO } from "../../domain/entities/Graduate";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";

export class ToggleGraduateFeatureUseCase {
  constructor(private readonly graduateRepository: GraduateRepository) {}

  async execute(id: string): Promise<GraduateResponseDTO> {
    const updated = await this.graduateRepository.toggleFeature(id);
    if (!updated) {
      throw new AppError("Graduate not found", 404);
    }
    return updated;
  }
}
