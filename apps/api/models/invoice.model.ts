import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersModel } from "./users.model";
import { emailAttachmentsModel } from "./emails.model";

export const invoiceModel = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  attachmentId: integer("attachment_id").notNull(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  vendorName: varchar("vendor_name", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  invoiceDate: timestamp("invoice_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  lineItems: numeric("line_items"),
  pdfUrl: text("pdf_url").notNull(),
  costCode: varchar("cost_code", { length: 50 }),
  quantity: numeric("quantity").notNull(),
  rate: numeric("rate").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoiceRelations = relations(invoiceModel, ({ one }) => ({
  user: one(usersModel, {
    fields: [invoiceModel.userId],
    references: [usersModel.id],
  }),

  attachment: one(emailAttachmentsModel, {
    fields: [invoiceModel.attachmentId],
    references: [emailAttachmentsModel.id],
  }),
}));
