
import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { usersModel } from "./users.model";
import { invoiceModel } from "./invoice.model";
import { relations } from "drizzle-orm";
export const providerEnum = pgEnum("provider", ["local", "gmail", "outlook"]);

export const emailAttachmentsModel = pgTable("email_attachments", {
  id: serial("id").primaryKey(),
  hashId: text("hash_id"),
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
  ({ one , many}) => ({
    user: one(usersModel, {
      fields: [emailAttachmentsModel.userId],
      references: [usersModel.id],
    }),
    invoice : many(invoiceModel)
  })
);
