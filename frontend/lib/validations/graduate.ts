import { z } from "zod";

export const createGraduateSchema = z.object({
  image: z
    .string()
    .trim()
    .min(1, "Graduate image is required"),
  featureOnLandingPage: z.boolean().default(false),
});

export type CreateGraduateInput = z.infer<typeof createGraduateSchema>;
