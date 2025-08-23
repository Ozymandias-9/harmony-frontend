import { z } from "zod";

export const categoryFormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    entity: z.string(),
})