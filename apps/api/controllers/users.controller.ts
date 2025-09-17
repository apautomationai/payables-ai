import { signJwt } from "@/lib/utils/jwt";

import { userServices } from "@/services/users.service";

import { NextFunction, Request, Response } from "express";
import passport from "@/lib/passport";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from "@/helpers/errors";

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
    } catch (err: any) {
      throw new ConflictError(err.message || "Unable to connect to the server");
    }
  };

  loginUser = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err) {
          // Catch DB "relation does not exist" error
          if (err.message.includes("users")) {
            return res.status(500).json({
              success: false,
              error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Users table not found in the database",
              },
            });
          }
          return next(err);
        }
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

  //@ts-ignore
  getUsers = async (req: Request, res: Response) => {
    try {
      const allUsers = await userServices.getUsers();

      return res.status(200).send(allUsers);
    } catch (error) {
      return new InternalServerError("Unable to connect to the server");
    }
  };
  updateUser = async (req: Request, res: Response) => {
    const { email } = req.body;
    const userData = req.body;

    if (!email) {
      throw new BadRequestError("Email is required");
    }

    try {
      const updatedUser = await userServices.updateUser(email, userData);

      if (updatedUser) {
        return res.status(200).send(updatedUser);
      }
      throw new BadRequestError("User has not updated");
    } catch (err: any) {
      throw new InternalServerError(
        err.message || "Unable to connect the server"
      );
    }
  };
  resetPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // const password = req.body;
    if (!email || !password) {
      throw new BadRequestError("Email, and Password are required");
    }
    const newPassword = await userServices.resetPassword(email, password);

    res.status(200).send(newPassword);
  };
}

export const userController = new UserController();
