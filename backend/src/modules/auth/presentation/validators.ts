import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().length(10),
  email: z.email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6).optional(),
}).refine(
  (data) => data.confirmPassword === undefined || data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().trim().email(),
});

export const resetPasswordWithOtpSchema = z
  .object({
    email: z.string().trim().email(),
    otp: z.string().trim().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
