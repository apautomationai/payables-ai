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
  // lineItems: numeric("line_items"),
  // costCode: varchar("cost_code", { length: 50 }),
  // quantity: numeric("quantity"),
  // rate: numeric("rate"),
  description: text("description"),
  fileUrl: text("file_url"),
  fileKey: text("file_key"),
  s3JsonKey: text("s3_json_key"),
  status: statusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lineItemsModel = pgTable("line_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  item_name: text("item_name"),
  description: text("description"),
  quantity: numeric("quantity"),
  rate: numeric("rate"),
  amount: numeric("amount"),
});

export const lineItemsRelations = relations(lineItemsModel, ({ one }) => ({
  invoice: one(invoiceModel, {
    fields: [lineItemsModel.invoiceId],
    references: [invoiceModel.id],
    relationName: "invoice",
  }),
}));


export const invoiceRelations = relations(invoiceModel, ({ one, many }) => ({
  user: one(usersModel, {
    fields: [invoiceModel.userId],
    references: [usersModel.id],
  }),

  attachment: one(attachmentsModel, {
    fields: [invoiceModel.attachmentId],
    references: [attachmentsModel.id],
  }),
  lineItems: many(lineItemsModel, {
    relationName: "lineItems",
  }),
}));
