import { z } from "zod";

export const submitInquirySchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(7, "Valid phone number is required").max(20),
  subject: z.string().trim().min(2, "Subject is required").max(150),
  message: z.string().trim().min(5, "Message is required").max(3000),
});
