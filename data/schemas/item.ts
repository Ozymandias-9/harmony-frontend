import { z } from "zod";

export const itemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.number().nullable().optional(),
  category: z
    .object({
      name: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;