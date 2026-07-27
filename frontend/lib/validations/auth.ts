import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export const forgotPasswordRequestSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export const resetPasswordWithOtpSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email"),
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordRequestFormData = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordWithOtpFormData = z.infer<typeof resetPasswordWithOtpSchema>;

export type AuthFormValues = {
  email: string;
  password: string;
  remember?: boolean;
  name?: string;
  phone?: string;
  confirmPassword?: string;
};