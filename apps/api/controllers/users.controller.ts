import { signJwt } from "@/lib/utils/jwt";

import { userServices } from "@/services/users.service";

import { NextFunction, Request, Response } from "express";
import passport from "@/lib/passport";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "@/helpers/errors";

export class UserController {
  registerUser = async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        avatar,
        businessName,
        email,
        phone,
        password,
      } = req.body;

      const result = await userServices.registerUser({
        firstName,
        lastName,
        avatar,
        businessName,
        email,
        phone,
        password,
      });

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
      async (err: any, user: any, info: any) => {
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
          id: (user as any).id,
          email: (user as any).email,
        });
        if (token) {
          await userServices.updateLastLogin(user.email);
        }

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
  getUserWithId = async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = 24;
    if (!userId) {
      throw new BadRequestError("Need a valid user id");
    }
    try {
      const response = await userServices.getUserWithId(userId);
      if (response.length === 0) {
        throw new NotFoundError("No user found");
      }
      const result = {
        success: "success",
        data: response[0],
      };
      return res.status(200).send(result);
    } catch (error: any) {
      throw new BadRequestError(error.message || "Unable to get user");
    }
  };
  updateUser = async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = 24;
    // const { email } = req.body;
    const userData = req.body;

    if (!userId) {
      throw new BadRequestError("Email is required");
    }

    try {
      const updatedUser = await userServices.updateUser(userId, userData);

      if (updatedUser) {
        const result = {
          success: "success",
          data: updatedUser[0],
        };
        return res.status(200).send(result);
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
    if (password?.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters");
    }
    const newPassword = await userServices.resetPassword(email, password);

    res.status(200).send(newPassword);
  };
  changePassword = async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.user.id;
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      if (!oldPassword || !newPassword || !confirmPassword) {
        throw new BadRequestError(
          "Old password, new password, confirm password are required"
        );
      }
      if (newPassword !== confirmPassword) {
        throw new BadRequestError(
          "new password should match the confirm password"
        );
      }
      const response = await userServices.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      if (!response) {
        throw new BadRequestError("Password has not change");
      }
      const result = {
        status: "success",
        data: {
          message: "Password changed successfully",
        },
      };
      return res.status(200).send(result);
    } catch (error: any) {
      throw new BadRequestError(error.message || "Unable to change password");
    }
  };
}

export const userController = new UserController();
