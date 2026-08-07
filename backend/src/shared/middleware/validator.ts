import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    // console.log("validater.......");
    
    const result = schema.safeParse(req.body);
    console.log(result);
    
    if (!result.success) {
      res.status(400).json({ errors: result.error.issues });
      return;
    }
    req.body = result.data;
    next();
  };
