import { prisma } from "../config/prisma.js";
import { CreateNoteInput, UpdateNoteInput } from "../schemas/note.schema.js";

export const noteService = {
  getAll() {
    return prisma.note.findMany({
orderBy: { createdAt: "desc" },
    });
  },

  getById(id: number) {
    return prisma.note.findUnique({
      where: { id },
    });
  },

  create(data: CreateNoteInput) {
    return prisma.note.create({
      data,
    });
  },

  update(id: number, data: UpdateNoteInput) {
    return prisma.note.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.note.delete({
      where: { id },
    });
  },
};
