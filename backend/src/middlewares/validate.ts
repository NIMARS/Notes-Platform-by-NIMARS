import { NextFunction, Request, Response } from "express";
import { ZodType, ZodError } from "zod";

type ReqPart = "body" | "params" | "query";

export const validate =
  (schema: ZodType<any>, part: ReqPart = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = (req as any)[part];

    const result = schema.safeParse(data);

    if (!result.success) {
        const error: ZodError<any> = result.error;
  
        const details = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
  
        return res.status(400).json({
          message: "Validation error",
          details,
        });
    }
      

    (req as any)[part] = result.data;
    next();
  };
