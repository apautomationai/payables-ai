import db from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/utils/hash";
import { eq, InferSelectModel } from "drizzle-orm";
import { usersModel } from "@/models/users.model";
import { signJwt } from "@/lib/utils/jwt";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "@/helpers/errors";

type User = InferSelectModel<typeof usersModel>;

type UpdateUser = Partial<User>;

export class UserServices {
  registerUser = async ({
    firstName,
    lastName,
    avatar,
    businessName,
    email,
    phone,
    password,
  }: {
    firstName: string;
    lastName: string;
    avatar: string;
    businessName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      if (!firstName || !email || !password) {
        throw new BadRequestError(
          "First name, email, and password are required"
        );
      }

      // Check if email already exists
      const [existingUser] = await db
        .select()
        .from(usersModel)
        .where(eq(usersModel.email, email));
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
        .values({
          firstName,
          lastName,
          avatar,
          businessName,
          email,
          phone,
          passwordHash,
        })
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
          phone: createdUser.phone,
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
  getUserWithId = async (userId: number) => {
    try {
      const user = await db
        .select()
        .from(usersModel)
        .where(eq(usersModel.id, userId));
      return user;
    } catch (error: any) {
      throw new BadRequestError(error.message || "No user found");
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

  changePassword = async (
    userId: number,
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      const [user] = await db
        .select()
        .from(usersModel)
        .where(eq(usersModel.id, userId));

      if (!user) {
        throw new NotFoundError("User not found");
      }
      //@ts-ignore
      const isMatch = await verifyPassword(oldPassword, user.passwordHash);
      if (!isMatch) {
        throw new BadRequestError("Old password is incorrect");
      }
      const hashed = await hashPassword(newPassword);

      // 4. Update password
      const response = await db
        .update(usersModel)
        .set({ passwordHash: hashed })
        .where(eq(usersModel.id, userId));
      return response;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  };
}

export const userServices = new UserServices();
