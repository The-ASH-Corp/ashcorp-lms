import { AppError } from "../../../../shared/error/AppError";
import { GraduateResponseDTO } from "../../domain/entities/Graduate";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";

export class GetGraduateByIdUseCase {
  constructor(private readonly graduateRepository: GraduateRepository) {}

  async execute(id: string): Promise<GraduateResponseDTO> {
    const graduate = await this.graduateRepository.findById(id);
    if (!graduate) {
      throw new AppError("Graduate not found", 404);
    }
    return graduate;
  }
}
