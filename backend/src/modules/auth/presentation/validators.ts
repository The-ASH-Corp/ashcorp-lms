import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().length(10),
  email: z.email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});