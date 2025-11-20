import { Router } from "express";
import { noteController } from "../controllers/note.controller.js";
import { validate } from "../middlewares/validate.js";
import { createNoteSchema, updateNoteSchema,  noteIdParamSchema } from "../schemas/note.schema.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", noteController.list);

router.get(
  "/:id",
  validate(noteIdParamSchema, "params"),
  noteController.getById
);

router.post(
  "/",
  validate(createNoteSchema, "body"),
  noteController.create
);

router.patch(
  "/:id",
  validate(noteIdParamSchema, "params"),
  validate(updateNoteSchema, "body"),
  noteController.update
);

router.delete(
  "/:id",
  validate(noteIdParamSchema, "params"),
  noteController.remove
);

export default router;