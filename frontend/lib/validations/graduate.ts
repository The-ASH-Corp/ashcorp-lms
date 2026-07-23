import { z } from "zod";

export const createGraduateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  positionName: z
    .string()
    .trim()
    .min(1, "Position name is required")
    .max(120, "Position name must be less than 120 characters"),
  image: z
    .string()
    .trim()
    .min(1, "Graduate image is required"),
  companyLogo: z
    .string()
    .trim()
    .min(1, "Company logo is required"),
  featureOnLandingPage: z.boolean().default(false),
});

export type CreateGraduateInput = z.infer<typeof createGraduateSchema>;
