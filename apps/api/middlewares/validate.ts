// validators/auth.validator.ts
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Zod schema for registration (separate from Drizzle table)
export const registerUserValidator = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginUserValidator = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// Middleware
export const validate = (schema: typeof registerUserValidator | typeof loginUserValidator) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
      schema.parse({
        body: req.body,
      });
      next();
    } catch (err) {
      const errors = (err as any).errors?.map((e: any) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
  };
};
