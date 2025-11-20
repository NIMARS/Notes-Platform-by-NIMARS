import { z } from "zod";

export const noteIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "id must be a positive integer")
    .transform((val) => Number(val)),
});

export const createNoteSchema = z.object({
  title: z.string().min(1, "title is required").max(255),
  content: z.string().default(""),
  isDone: z.boolean().optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

export type NoteIdParam = z.infer<typeof noteIdParamSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;