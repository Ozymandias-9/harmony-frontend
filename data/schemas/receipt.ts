import { z } from "zod";

const purchaseSchema = z.object({
  id: z.coerce.number().nullable().optional(),
  quantity: z.coerce.number().nullable().optional(),
  unitPrice: z.coerce.number().nullable().optional(),
  price: z.coerce.number().nullable().optional(),
  itemId: z.coerce.number().nullable().optional(),
});

export const receiptFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  store: z.string().min(1, "Store is required"),
  creationDate: z.date(),
  purchases: z
    .array(purchaseSchema)
    .optional()
    .transform((arr) =>
      arr?.filter((p) => Object.values(p).some((v) => v !== undefined && v !== null))
    ),
  categoryId: z.number().nullable().optional(),
  category: z
    .object({
      name: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;