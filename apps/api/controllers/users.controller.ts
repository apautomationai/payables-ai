import { signJwt } from "@/lib/utils/jwt";

import { userServices } from "@/services/users.service";

import { NextFunction, Request, Response } from "express";
import passport from "passport";

export class UserController {
  registerUser = async (req: Request, res: Response) => {
    try {
      const { name, age, email, password } = req.body;

      const result = userServices.registerUser(name, age, email, password);

      return res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
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
