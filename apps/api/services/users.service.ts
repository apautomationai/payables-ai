import db from "@/lib/db";
import { hashPassword } from "@/lib/utils/hash";
import { eq } from "drizzle-orm";
import { usersTable } from "@/models/users.model";
import { signJwt } from "@/lib/utils/jwt";
import { BadRequestError, ConflictError } from "@/helpers/errors";



export class UserServices {

    registerUser = async (name:string,  email:string, password:string)=> {
        try {
            if (!name || !email || !password) {
                throw new BadRequestError("Name, email, and password are required")
      }

      // Check if email already exists
      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
        .then((r) => r[0]);

      if (existingUser) {
        throw new ConflictError("Email already in use")
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
            throw new BadRequestError()
        }
    }


}

export const userServices = new UserServices();