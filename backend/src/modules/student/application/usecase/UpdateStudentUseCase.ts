import bcrypt from "bcrypt";
import { AppError } from "../../../../shared/error/AppError";
import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

interface UpdateStudentInput {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  status?: string;
}

export class UpdateStudentUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, data: UpdateStudentInput): Promise<User> {
    const existingStudent = await this.userRepository.findById(id);

    if (!existingStudent) {
      throw new AppError("Student not found", 404);
    }

    const updateData: Partial<User> = {};

    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (trimmedName.length < 2) {
        throw new AppError("Name must be at least 2 characters", 400);
      }
      updateData.name = trimmedName;
    }

    if (data.email !== undefined) {
      const trimmedEmail = data.email.trim().toLowerCase();
      const existingEmail = await this.userRepository.findByEmail(trimmedEmail);

      if (existingEmail && existingEmail._id?.toString() !== id) {
        throw new AppError("Email already exists", 400);
      }

      updateData.email = trimmedEmail;
    }

    if (data.phone !== undefined) {
      const phoneStr = String(data.phone).trim();
      if (phoneStr.length !== 10) {
        throw new AppError("Phone number must be exactly 10 digits", 400);
      }
      updateData.phone = Number(phoneStr);
    }

    if (data.password) {
      if (!data.confirmPassword || data.password !== data.confirmPassword) {
        throw new AppError("Passwords must match", 400);
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    return this.userRepository.update(id, updateData);
  }
}
