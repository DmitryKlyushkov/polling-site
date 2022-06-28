import { z } from "zod";

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(600),
  options: z
    .array(z.object({ text: z.string().min(1).max(255) }))
    .min(2)
    .max(20),
});

export type CreateInputQuestionType = z.infer<typeof createQuestionValidator>;
