import { GraduateResponseDTO } from "../../domain/entities/Graduate";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";

export class GetAllGraduatesDetails {
  constructor(private readonly graduateRepository: GraduateRepository) {}

  async execute(): Promise<GraduateResponseDTO[]> {
    return this.graduateRepository.findAll();
  }
}
