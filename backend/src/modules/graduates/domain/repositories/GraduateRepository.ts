import { Graduate, GraduateResponseDTO } from "../entities/Graduate";

export interface GraduateRepository {
  create(data: Graduate): Promise<GraduateResponseDTO>;
  findAll(): Promise<GraduateResponseDTO[]>;
  findFeatured(): Promise<GraduateResponseDTO[]>;
  findById(id: string): Promise<GraduateResponseDTO | null>;
  delete(id: string): Promise<boolean>;
  toggleFeature(id: string): Promise<GraduateResponseDTO | null>;
  update(id: string, data: Partial<Graduate>): Promise<GraduateResponseDTO | null>;
}
