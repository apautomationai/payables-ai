import db from "@/lib/db";
import { hashPassword } from "@/lib/utils/hash";
import { eq, InferSelectModel } from "drizzle-orm";
import { usersModel } from "@/models/users.model";
import { signJwt } from "@/lib/utils/jwt";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from "@/helpers/errors";

type User = InferSelectModel<typeof usersModel>;

type UpdateUser = Partial<User>;

export class UserServices {
  registerUser = async ({firstName, lastName, avatar, email, password}: {firstName: string, lastName: string, avatar: string, email: string, password: string}) => {
    try {
      if (!firstName || !email || !password) {
        throw new BadRequestError(
          "First name, email, and password are required"
        );
      }

      // Check if email already exists
      const [existingUser] = await db.select().from(usersModel).where(eq(usersModel.email, email));
      console.log("use exists", existingUser);

      if (existingUser) {
        throw new ConflictError("Email already in use");
      }

      // Hash the password
      const passwordHash = await hashPassword(password);

      // Insert the new user
      const inserted = await db
        .insert(usersModel)
        //@ts-ignore
        .values({ firstName, lastName, avatar, email, passwordHash })
        .returning();

      const createdUser = Array.isArray(inserted) ? inserted[0] : inserted;

      // Issue JWT
      const token = signJwt({ sub: createdUser.id, email: createdUser.email });

      return {
        user: {
          id: createdUser.id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          avatar: createdUser.avatar,
          email: createdUser.email,
        },
        token,
      };
    } catch (error: any) {
      throw new BadRequestError(error.message || "Registration failed");
    }
  };
  getUsers = async () => {
    try {
      const allUsers = await db.select().from(usersModel);

      return allUsers;
    } catch (error) {
      return [];
    }
  };
  updateUser = async (email: string, userData: UpdateUser) => {
    if (!email) {
      throw new BadRequestError("Email is required");
    }
    try {
      const updatedUser = await db
        .update(usersModel)
        .set(userData)
        .where(eq(usersModel.email, email))
        .returning();
      return updatedUser;
    } catch (error: any) {
      if (error.message) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  };

  updateLastLogin = async (email: string) => {
    try {
      const updatedLogin = await db
        .update(usersModel)
        .set({ lastLogin: new Date() })
        .where(eq(usersModel.email, email))
        .returning();
      console.log(updatedLogin);
      return updatedLogin;
    } catch (error: any) {
      throw error;
    }
  };

  resetPassword = async (email: string, password: string) => {
    if (!password) {
      throw new BadRequestError("Enter a valid password");
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    try {
      const newPassword = await db
        .update(usersModel)
        .set({ passwordHash })
        .where(eq(usersModel.email, email))
        .returning();

      return newPassword;
    } catch (error: any) {
      if (error.message.includes("users")) {
        throw new InternalServerError("Users table not found in the database");
      }
      throw error;
    }
  };

  // getRefreshToken = async (email: string) => {
  //   try {
  //     const result = await db
  //       .select({ refreshToken: usersModel.refreshToken })
  //       .from(usersModel)
  //       .where(eq(usersModel.email, email));
  //     const token = result.length > 0 ? result[0].refreshToken : null;
  //     return token;
  //   } catch (error) {
  //     throw new NotFoundError("No token found");
  //   }
  // };

  // updateTokens = async (
  //   email: string,
  //   refreshToken: string ,
  //   accessToken: string ,
  //   expiryDate: any
  // ) => {
  //   if (!email) {
  //     throw new BadRequestError("Need a valid email");
  //   }
  //   try {
  //     const newTokens = await db
  //       .update(usersModel)
  //       .set({
  //         refreshToken: refreshToken,
  //         accessToken: accessToken,
  //         expiryDate: expiryDate,
  //       })
  //       .where(eq(usersModel.email, email))
  //       .returning();
  //       return newTokens
  //   } catch (error: any) {
  //     throw new BadRequestError(error.message || "Unable to update token");
  //   }
  // };
}

export const userServices = new UserServices();
