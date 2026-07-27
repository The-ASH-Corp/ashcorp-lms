import { AppError } from "../../../../shared/error/AppError";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { AdminRepository } from "../../../admins/domain/repositories/AdminRepository";
import bcrypt from "bcrypt";
import { PASSWORD_POLICY_MESSAGE, isStrongPassword } from "../../shared/passwordPolicy";

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async execute(
    userId: string,
    data: { currentPassword: string; newPassword: string; confirmPassword: string },
  ): Promise<void> {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new AppError("All password fields are required", 400);
    }

    if (!isStrongPassword(newPassword)) {
      throw new AppError(PASSWORD_POLICY_MESSAGE, 400);
    }

    if (newPassword !== confirmPassword) {
      throw new AppError("New passwords do not match", 400);
    }

    const user = await this.userRepository.findByIdWithPassword(userId);
    const admin = user ? null : await this.adminRepository.findByIdWithPassword(userId);
    const authenticatedUser = user ?? admin;

    if (!authenticatedUser) {
      throw new AppError("User not found", 404);
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, authenticatedUser.password);

    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    if (user) {
      await this.userRepository.update(userId, { password: hashedPassword } as any);
    } else if (admin) {
      await this.adminRepository.update(userId, { password: hashedPassword } as any);
    }
  }
}
