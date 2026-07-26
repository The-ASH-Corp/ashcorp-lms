import { z } from "zod";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_POLICY_MESSAGE,
  STRONG_PASSWORD_REGEX,
} from "../shared/passwordPolicy";

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH)
  .max(PASSWORD_MAX_LENGTH)
  .regex(STRONG_PASSWORD_REGEX, PASSWORD_POLICY_MESSAGE);

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().length(10),
  email: z.email(),
  password: passwordSchema,
  confirmPassword: passwordSchema.optional(),
}).refine(
  (data) => data.confirmPassword === undefined || data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().trim().email(),
});

export const resetPasswordWithOtpSchema = z
  .object({
    email: z.string().trim().email(),
    otp: z.string().trim().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });
