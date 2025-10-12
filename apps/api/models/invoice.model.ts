import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersModel } from "./users.model";
import { attachmentsModel } from "./attachments.model";
export const statusEnum = pgEnum("status", [
  "pending",
  "approved",
  "rejected",
  "failed",
  "not_connected"
]);

export const invoiceModel = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  attachmentId: integer("attachment_id").notNull(),
  invoiceNumber: varchar("invoice_number", { length: 50 }),
  vendorName: varchar("vendor_name", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }),
  invoiceDate: timestamp("invoice_date"),
  dueDate: timestamp("due_date"),
  totalAmount: numeric("total_amount"),
  currency: varchar("currency", { length: 10 }),
  lineItems: numeric("line_items"),
  costCode: varchar("cost_code", { length: 50 }),
  quantity: numeric("quantity"),
  rate: numeric("rate"),
  description: text("description"),
  fileUrl: text("file_url"),
  fileKey: text("file_key"),
  status: statusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoiceRelations = relations(invoiceModel, ({ one }) => ({
  user: one(usersModel, {
    fields: [invoiceModel.userId],
    references: [usersModel.id],
  }),

  attachment: one(attachmentsModel, {
    fields: [invoiceModel.attachmentId],
    references: [attachmentsModel.id],
  }),
}));
