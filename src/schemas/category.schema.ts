import { z } from "zod";

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, "Category name is required.").max(50),
  description: z.string().trim().max(200).optional().nullable(),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
