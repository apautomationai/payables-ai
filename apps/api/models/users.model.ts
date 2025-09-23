import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  bigint,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  profileImage: varchar("profile_image", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: varchar("phone", { length: 20 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
  lastLogin: timestamp("last_login").defaultNow(),
  refreshToken: text("refresh_token").notNull().default(""),
  accessToken: text("access_token").notNull().default(""),
  expiryDate: bigint("expiry_date", { mode: "number" }).notNull(),
});

export const attachments = pgTable("attachments", {
  id: text("id").primaryKey(),
  emailId: text("email_id").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  sender: text("sender").notNull(),
  receiver: text("receiver").notNull(),
  s3Url: text("key").default(""),
  created_at: timestamp("created_at").defaultNow(),
});
