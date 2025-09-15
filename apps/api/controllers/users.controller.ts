import { signJwt } from "@/lib/utils/jwt";

import { userServices } from "@/services/users.service";

import { NextFunction, Request, Response } from "express";
import passport from "@/lib/passport";
import { ConflictError } from "@/helpers/errors";

export class UserController {
  registerUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const result = await userServices.registerUser(name, email, password);

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      throw new ConflictError("Email already in use");
    }
  };

  loginUser = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user)
          return res
            .status(401)
            .json({ message: info?.message || "Unauthorized" });

        const token = signJwt({
          sub: (user as any).id,
          email: (user as any).email,
        });
        return res.json({ user, token });
      }
    )(req, res, next);
  };
}

export const userController = new UserController();
