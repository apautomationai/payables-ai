import db from "@/lib/db";
import { hashPassword } from "@/lib/utils/hash";
import { eq, InferSelectModel } from "drizzle-orm";
import { usersTable } from "@/models/users.model";
import { signJwt } from "@/lib/utils/jwt";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from "@/helpers/errors";

type User = InferSelectModel<typeof usersTable>;

type UpdateUser = Partial<User>;

export class UserServices {
  registerUser = async (name: string, email: string, password: string) => {
    try {
      if (!name || !email || !password) {
        throw new BadRequestError("Name, email, and password are required");
      }

      // Check if email already exists
      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
        .then((r) => r[0]);
      if (existingUser) {
        throw new ConflictError("Email already in use");
      }

      // Hash the password
      const passwordHash = await hashPassword(password);

      // Insert the new user
      const inserted = await db
        .insert(usersTable)
        .values({ name, email, passwordHash })
        .returning();

      const createdUser = Array.isArray(inserted) ? inserted[0] : inserted;

      // Issue JWT
      const token = signJwt({ sub: createdUser.id, email: createdUser.email });

      return {
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        },
        token,
      };
    } catch (error) {
      throw new BadRequestError("Registration failed");
    }
  };
  getUsers = async () => {
    try {
      const allUsers = await db.select().from(usersTable);

      return allUsers;
      
    } catch (error) {
      return [];
    }
  };
  updateUser = async (email: string, userData: UpdateUser) => {
    try {
      const updatedUser = await db
        .update(usersTable)
        .set(userData)
        .where(eq(usersTable.email, email))
        .returning();
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  resetPassword = async (email: string, password: string) => {
    // Hash the password
    const passwordHash = await hashPassword(password);

    try {
      const newPassword = await db
        .update(usersTable)
        .set({ passwordHash })
        .where(eq(usersTable.email, email))
        .returning();

      return newPassword;
    } catch (error: any) {
      console.log("error -", error.message);
      if (error.message.includes("users")) {
        throw new InternalServerError("Users table not found in the database");
      }
      throw error;
    }
  };
}

export const userServices = new UserServices();
