import { InstructorRepository } from "../../domain/repositories/InstructorRepository";
import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRequestDTO } from "../dto/InstructorDTO";
import { AppError } from "../../../../shared/error/AppError";
import bcrypt from "bcrypt";

export class UpdateInstructorUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(id: string, data: InstructorRequestDTO, image?: string): Promise<Instructor> {
    const existingInstructor = await this.instructorRepository.findById(id);

    if (!existingInstructor) {
      throw new AppError("Instructor not found", 404);
    }

    const nextData: InstructorRequestDTO = {
      ...data,
      password: data.password ?? existingInstructor.password,
      confirmPassword: data.confirmPassword ?? data.password ?? existingInstructor.password,
      profileImage: image ?? existingInstructor.profileImage,
    };

    if (nextData.password && nextData.password !== nextData.confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    if (nextData.password && nextData.password !== existingInstructor.password) {
      nextData.password = await bcrypt.hash(nextData.password, 10);
    }

    if (data.email && data.email !== existingInstructor.email) {
      const emailExists = await this.instructorRepository.findByEmail(data.email);
      if (emailExists && emailExists._id?.toString() !== id) {
        throw new AppError("Email already exists", 400);
      }
    }

    if (data.phone && data.phone !== existingInstructor.phone) {
      const phoneExists = await this.instructorRepository.findByMobileNumber(data.phone);
      if (phoneExists && phoneExists._id?.toString() !== id) {
        throw new AppError("Phone number already exists", 400);
      }
    }

    return this.instructorRepository.updateInstructor(id, nextData, image);
  }
}
