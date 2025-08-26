import { z } from "zod";

export const itemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categories: z.array(z.number()).nullable().optional(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;