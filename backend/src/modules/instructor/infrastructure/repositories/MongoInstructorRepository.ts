import { InstructorRequestDTO } from "../../application/dto/InstructorDTO";
import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";
import { InstructorModel } from "../models/InstructorModel";

export class MongoInstructorRepository implements InstructorRepository {
  async createInstructor(data: InstructorRequestDTO): Promise<Instructor> {
    return await InstructorModel.create(data);
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    return await InstructorModel.findOne({ email });
  }

  async findByMobileNumber(mobileNumber: string): Promise<Instructor | null> {
    return await InstructorModel.findOne({ phone: mobileNumber });
  }

  async findAll(): Promise<Instructor[]> {
    return await InstructorModel.find();
  }

  async findById(id: string): Promise<Instructor | null> {
    return await InstructorModel.findById(id);
  }
}