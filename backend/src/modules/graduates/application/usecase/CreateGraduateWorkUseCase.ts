import { AppError } from "../../../../shared/error/AppError";
import { GraduateResponseDTO } from "../../domain/entities/Graduate";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";
import { CreateGraduateRequestDTO } from "../dto/GraduateDTO";

export class CreateGraduateWorkUseCase {
  constructor(private readonly graduateRepository: GraduateRepository) {}

  async execute(data: CreateGraduateRequestDTO): Promise<GraduateResponseDTO> {
    
    if (!data.name || !data.image || !data.positionName || !data.companyLogo) {
      throw new AppError(
        "Name, image, position name and company logo are required",
        400,
      );
    }

    return this.graduateRepository.create({
      name: data.name,
      image: data.image,
      positionName: data.positionName,
      companyLogo: data.companyLogo,
      featureOnLandingPage: data.featureOnLandingPage ?? false,
    });
  }
}
