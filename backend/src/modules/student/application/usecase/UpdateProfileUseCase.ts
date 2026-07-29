import { AppError } from "../../../../shared/error/AppError";
import { Admin } from "../../../admins/domain/entities/Admin";
import { AdminRepository } from "../../../admins/domain/repositories/AdminRepository";
import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class UpdateProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async execute(
    userId: string,
    data: { name?: string; phone?: string; profileImage?: string },
  ): Promise<User | Admin> {
    const user = await this.userRepository.findById(userId);
    const admin = user ? null : await this.adminRepository.findById(userId);
    const currentUser = user ?? admin;

    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    const updateData: Partial<User | Admin> = {};

    if (data.name !== undefined) {
      if (data.name.trim().length < 2) {
        throw new AppError("Name must be at least 2 characters", 400);
      }
      updateData.name = data.name.trim();
    }

    if (data.phone !== undefined) {
      const phoneStr = String(data.phone);
      if (phoneStr.length !== 10) {
        throw new AppError("Phone number must be exactly 10 digits", 400);
      }
      updateData.phone = Number(phoneStr);
    }

    if (data.profileImage !== undefined) {
      updateData.profileImage = data.profileImage;
    }

    if (user) {
      return await this.userRepository.update(userId, updateData as Partial<User>);
    }

    return await this.adminRepository.update(userId, updateData as Partial<Admin>);
  }
}
