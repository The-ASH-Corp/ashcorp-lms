import { z } from 'zod';

export const createInstructorSchema = z
  .object({
    name: z.string().trim().min(2, 'Full name is required'),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z.string().trim().regex(/^\+?[0-9\s-]{8,15}$/, 'Enter a valid phone number'),
    instructorTitle: z.string().trim().min(3, 'Instructor title is required'),
    about: z.string().trim().min(20, 'Please share a bit more about the instructor'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
    isFeatured: z.boolean().optional(),
    verifyByDefault: z.boolean().optional(),
    profileImage: z.instanceof(File, { message: 'Please upload a profile image' }).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords must match',
      });
    }
  });
