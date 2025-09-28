import db from "@/lib/db";
import { usersModel } from "@/models/users.model";
import { eq } from "drizzle-orm";
import { Request, Response, NextFunction } from "express-serve-static-core";

const jwt = require("jsonwebtoken");

//@ts-ignore
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  try {
    // Get token from header

    const authHeader = req.headers.authorization;

    token = req.cookies.token;
    if (!token) {
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const [user] = await db
      .select()
      .from(usersModel)
      .where(eq(usersModel.id, decoded.id));
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    //@ts-ignore
    req.token = token;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({ message: "Authentication failed" });
  }
};
