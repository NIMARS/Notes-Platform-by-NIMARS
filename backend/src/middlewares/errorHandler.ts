import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err); // может потом в логи отдельные -_-

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      message: "Validation error",
      details,
    });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Note not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Unique constraint failed" });
    }
  }


  return res.status(500).json({ message: "Internal server error" });
};
