import { NextFunction, Request, Response } from "express";
import { noteService } from "../services/note.service.js";
import type { AuthPayload } from "../middlewares/auth.js";

export const noteController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user as AuthPayload;
      const notes = await noteService.getAllByUser(user.userId);
      res.json(notes);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as any;
      const user = (req as any).user as AuthPayload;
      const note = await noteService.getByIdForUser(Number(id), user.userId);

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
      const user = (req as any).user as AuthPayload;
      const note = await noteService.create(user.userId, req.body);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as any;
      const user = (req as any).user as AuthPayload;
      const note = await noteService.update(Number(id), user.userId, req.body);
      res.json(note);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as any;
      const user = (req as any).user as AuthPayload;
      await noteService.delete(Number(id), user.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};