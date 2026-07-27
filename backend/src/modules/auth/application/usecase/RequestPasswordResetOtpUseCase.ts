import crypto from "crypto";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { AdminRepository } from "../../../admins/domain/repositories/AdminRepository";
import { PasswordResetOtpModel } from "../../infrastructure/models/PasswordResetOtpModel";
import { ENV } from "../../../../shared/env/ENV";
import { sendMail } from "../../../../shared/mail/mailer";
import { AppError } from "../../../../shared/error/AppError";

export class RequestPasswordResetOtpUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async execute(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);
    const admin = user ? null : await this.adminRepository.findByEmail(normalizedEmail);

    // Never reveal whether the email exists.
    if (!user && !admin) {
      return;
    }

    const now = Date.now();
    const cooldownMs = ENV.OTP_REQUEST_COOLDOWN_SECONDS * 1000;
    const windowMs = ENV.OTP_REQUEST_WINDOW_MINUTES * 60 * 1000;
    const existingOtpDoc = await PasswordResetOtpModel.findOne({ email: normalizedEmail });

    if (existingOtpDoc?.lastRequestedAt) {
      const elapsedSinceLastRequest = now - existingOtpDoc.lastRequestedAt.getTime();
      if (elapsedSinceLastRequest < cooldownMs) {
        throw new AppError(
          `Please wait ${ENV.OTP_REQUEST_COOLDOWN_SECONDS} seconds before requesting another OTP.`,
          429,
        );
      }
    }

    const hasActiveWindow =
      !!existingOtpDoc?.requestWindowStart &&
      now - existingOtpDoc.requestWindowStart.getTime() <= windowMs;

    const nextRequestCount = hasActiveWindow ? (existingOtpDoc?.requestCount ?? 0) + 1 : 1;

    if (hasActiveWindow && nextRequestCount > ENV.OTP_REQUEST_MAX_PER_WINDOW) {
      throw new AppError(
        `Too many OTP requests. Please try again after ${ENV.OTP_REQUEST_WINDOW_MINUTES} minutes.`,
        429,
      );
    }

    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + ENV.OTP_EXPIRY_MINUTES * 60 * 1000);

    await PasswordResetOtpModel.findOneAndUpdate(
      { email: normalizedEmail },
      {
        otpHash,
        expiresAt,
        attempts: 0,
        requestCount: nextRequestCount,
        requestWindowStart: hasActiveWindow ? existingOtpDoc?.requestWindowStart : new Date(now),
        lastRequestedAt: new Date(now),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const targetName = user?.name ?? admin?.name ?? "there";

    await sendMail({
      to: normalizedEmail,
      subject: "Your Password Reset OTP",
      text: `Hello ${targetName}, your OTP is ${otp}. It will expire in ${ENV.OTP_EXPIRY_MINUTES} minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <h2>Password Reset Request</h2>
          <p>Hello ${targetName},</p>
          <p>Use the OTP below to reset your password:</p>
          <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
          <p>This OTP will expire in ${ENV.OTP_EXPIRY_MINUTES} minutes.</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `,
    });
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private hashOtp(otp: string): string {
    return crypto
      .createHash("sha256")
      .update(`${otp}:${ENV.JWT_SECRET}`)
      .digest("hex");
  }
}
