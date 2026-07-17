import { InstructorRequestDTO } from "../../application/dto/InstructorDTO";
import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";
import { InstructorModel } from "../models/InstructorModel";

export class MongoInstructorRepository implements InstructorRepository {
  async createInstructor(data: InstructorRequestDTO): Promise<Instructor> {
    return (await InstructorModel.create(data)) as unknown as Instructor;
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

  async deleteInstructor(id: string): Promise<void> {
    await InstructorModel.findByIdAndDelete(id);
  }

  async updateStatus(id: string, status: string): Promise<Instructor> {
    const instructor = await InstructorModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!instructor) {
      throw new Error("Instructor not found");
    }

    return instructor as unknown as Instructor;
  }
}
