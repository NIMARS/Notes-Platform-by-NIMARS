import { NextFunction, Request, Response } from "express";
import { noteService } from "../services/note.service.js";

export const noteController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notes = await noteService.getAll();
      res.json(notes);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number((req.params as any).id);
      const note = await noteService.getById(id);

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json(note);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await noteService.create(req.body);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number((req.params as any).id);
      const note = await noteService.update(id, req.body);
      res.json(note);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number((req.params as any).id);
      await noteService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
