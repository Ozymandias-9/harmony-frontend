import { z } from "zod";

export const ticketFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    store: z.string().min(1, "Store is required"),
    creationDate: z.date(),
    purchases: z.array(z.object({ price: z.number(), purchaseDate: z.date(), itemId: z.number() })),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;