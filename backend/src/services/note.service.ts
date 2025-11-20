import { prisma } from "../config/prisma.js";
import { CreateNoteInput, UpdateNoteInput } from "../schemas/note.schema.js";

export const noteService = {
  getAllByUser(userId: number) {
    return prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  getByIdForUser(id: number, userId: number) {
    return prisma.note.findFirst({
      where: { id, userId },
    });
  },

  create(userId: number, data: CreateNoteInput) {
    return prisma.note.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  update(id: number, userId: number, data: UpdateNoteInput) {
    return prisma.note.update({
      where: { id, userId },
      data,
    });
  },

  delete(id: number, userId: number) {
    return prisma.note.delete({
      where: { id, userId },
    });
  },
};

