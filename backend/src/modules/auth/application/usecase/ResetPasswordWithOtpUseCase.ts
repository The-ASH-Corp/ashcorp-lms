import bcrypt from "bcrypt";
import crypto from "crypto";
import { AppError } from "../../../../shared/error/AppError";
import { ENV } from "../../../../shared/env/ENV";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { AdminRepository } from "../../../admins/domain/repositories/AdminRepository";
import { PasswordResetOtpModel } from "../../infrastructure/models/PasswordResetOtpModel";
import { PASSWORD_POLICY_MESSAGE, isStrongPassword } from "../../shared/passwordPolicy";

export class ResetPasswordWithOtpUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async execute(data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    const { email, otp, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    if (!isStrongPassword(newPassword)) {
      throw new AppError(PASSWORD_POLICY_MESSAGE, 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);
    const admin = user ? null : await this.adminRepository.findByEmail(normalizedEmail);

    if (!user && !admin) {
      throw new AppError("Invalid OTP or email", 400);
    }

    const otpDoc = await PasswordResetOtpModel.findOne({ email: normalizedEmail });

    if (!otpDoc) {
      throw new AppError("OTP not found or expired", 400);
    }

    if (otpDoc.expiresAt.getTime() < Date.now()) {
      await PasswordResetOtpModel.deleteOne({ email: normalizedEmail });
      throw new AppError("OTP has expired", 400);
    }

    const incomingHash = crypto
      .createHash("sha256")
      .update(`${otp}:${ENV.JWT_SECRET}`)
      .digest("hex");

    if (incomingHash !== otpDoc.otpHash) {
      otpDoc.attempts += 1;

      if (otpDoc.attempts >= ENV.OTP_MAX_ATTEMPTS) {
        await PasswordResetOtpModel.deleteOne({ email: normalizedEmail });
        throw new AppError("Maximum OTP attempts reached. Please request a new OTP.", 400);
      }

      await otpDoc.save();
      throw new AppError("Invalid OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (user?._id) {
      await this.userRepository.update(String(user._id), { password: hashedPassword } as any);
    } else if (admin?._id) {
      await this.adminRepository.update(String(admin._id), { password: hashedPassword } as any);
    }

    await PasswordResetOtpModel.deleteOne({ email: normalizedEmail });
  }
}
