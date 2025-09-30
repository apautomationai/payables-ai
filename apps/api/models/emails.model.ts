import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersModel } from "./users.model";
export const providerEnum = pgEnum("provider", ["local", "gmail", "outlook"]);

export const emailAttachmentsModel = pgTable("email_attachments", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  emailId: text("email_id"),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  sender: text("sender"),
  receiver: text("receiver"),
  provider: providerEnum("provider").notNull().default("local"),
  s3Url: text("key"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const emailAttachmentsRelations = relations(
  emailAttachmentsModel,
  ({ one }) => ({
    user: one(usersModel, {
      fields: [emailAttachmentsModel.userId],
      references: [usersModel.id],
    }),
  })
);
