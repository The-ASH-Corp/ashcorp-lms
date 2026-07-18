import { z } from "zod";

const optionSchema = z.object({
  text: z.string().trim().min(1, "Option is required"),
  isCorrect: z.boolean(),
});

const mcqSchema = z.object({
  type: z.literal("multiple-choice"),
  title: z.string().trim().min(1, "Question title is required"),
  options: z.array(optionSchema).length(4),
})
  .superRefine((question, ctx) => {
    const count = question.options.filter(o => o.isCorrect).length;

    if (count !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select exactly one correct answer",
        path: ["options"],
      });
    }
  });
  
 const trueFalseSchema = z.object({
  type: z.literal("true-false"),
  title: z.string().trim().min(1, "Question title is required"),
  options: z.array(optionSchema).length(2),
})
  .superRefine((question, ctx) => {
    const count = question.options.filter(o => o.isCorrect).length;

    if (count !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select either True or False",
        path: ["options"],
      });
    }
  });

  export const examSchema = z.object({
  courseTitle: z.string().trim().min(1, "Please select a course"),

  examTitle: z.string().trim().min(1, "Exam title is required"),

  duration: z.coerce.number().positive(),

  marksPerQuestion: z.coerce.number().positive(),

  passMarks: z.coerce.number().positive(),

  questions: z
    .array(
      z.discriminatedUnion("type", [
        mcqSchema,
        trueFalseSchema,
      ])
    )
    .min(1, "At least one question is required"),
});