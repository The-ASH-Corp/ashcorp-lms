import {
  Graduate,
  GraduateResponseDTO,
} from "../../domain/entities/Graduate";
import { GraduateRepository } from "../../domain/repositories/GraduateRepository";
import { GraduateDocument, GraduateModel } from "../models/GraduateModel";

export class MongoGraduateRepository implements GraduateRepository {
  async create(data: Graduate): Promise<GraduateResponseDTO> {
    const graduate = await GraduateModel.create(data);
    return this.toDTO(graduate.toObject() as GraduateDocument);
  }

  async findAll(): Promise<GraduateResponseDTO[]> {
    const graduates = await GraduateModel.find({}).sort({ createdAt: -1 }).lean();
    return graduates.map((graduate) => this.toDTO(graduate as GraduateDocument));
  }

  async findFeatured(): Promise<GraduateResponseDTO[]> {
    const graduates = await GraduateModel.find({ featureOnLandingPage: true })
      .sort({ createdAt: -1 })
      .lean();
    return graduates.map((graduate) => this.toDTO(graduate as GraduateDocument));
  }

  async findById(id: string): Promise<GraduateResponseDTO | null> {
    const graduate = await GraduateModel.findById(id).lean();
    if (!graduate) return null;
    return this.toDTO(graduate as GraduateDocument);
  }

  async delete(id: string): Promise<boolean> {
    const result = await GraduateModel.findByIdAndDelete(id);
    return !!result;
  }

  async toggleFeature(id: string): Promise<GraduateResponseDTO | null> {
    const graduate = await GraduateModel.findById(id);
    if (!graduate) return null;
    graduate.featureOnLandingPage = !graduate.featureOnLandingPage;
    await graduate.save();
    return this.toDTO(graduate.toObject() as GraduateDocument);
  }

  async update(id: string, data: Partial<Graduate>): Promise<GraduateResponseDTO | null> {
    const graduate = await GraduateModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!graduate) return null;
    return this.toDTO(graduate.toObject() as GraduateDocument);
  }

  private toDTO(graduate: GraduateDocument): GraduateResponseDTO {
    return {
      id: graduate._id.toString(),
      image: graduate.image,
      featureOnLandingPage: graduate.featureOnLandingPage,
      createdAt: graduate.createdAt,
      updatedAt: graduate.updatedAt,
    };
  }
}
