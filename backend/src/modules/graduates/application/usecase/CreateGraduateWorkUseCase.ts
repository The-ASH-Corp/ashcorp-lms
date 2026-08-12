import { AppError } from "../../../../shared/error/AppError";
import { GraduateResponseDTO } from "../../domain/entities/Graduate";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";
import { CreateGraduateRequestDTO } from "../dto/GraduateDTO";

export class CreateGraduateWorkUseCase {
  constructor(private readonly graduateRepository: GraduateRepository) {}

  async execute(data: CreateGraduateRequestDTO): Promise<GraduateResponseDTO> {
    
    if (!data.image) {
      throw new AppError(
        "Image is required",
        400,
      );
    }

    return this.graduateRepository.create({
      image: data.image,
      featureOnLandingPage: data.featureOnLandingPage ?? false,
    });
  }
}
