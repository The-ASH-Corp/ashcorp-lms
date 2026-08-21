import { GraduateResponseDTO } from "../../domain/entities/Graduate";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";

export class GetPaginatedGraduatesUseCase {
  constructor(private graduateRepository: GraduateRepository) {}

  async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ graduates: GraduateResponseDTO[]; totalGraduates: number }> {
    const { graduates, total } = await this.graduateRepository.findPaginated(
      page,
      limit,
      search,
    );

    return { graduates, totalGraduates: total };
  }
}
