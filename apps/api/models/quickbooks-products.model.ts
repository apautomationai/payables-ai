import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { usersModel } from "./users.model";

export const quickbooksProductsModel = pgTable(
  "quickbooks_products",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersModel.id),
    quickbooksId: varchar("quickbooks_id", { length: 50 }).notNull(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    active: boolean("active"),
    fullyQualifiedName: varchar("fully_qualified_name", { length: 255 }),
    taxable: boolean("taxable"),
    unitPrice: numeric("unit_price"),
    type: varchar("type", { length: 50 }),
    incomeAccountValue: varchar("income_account_value", { length: 50 }),
    incomeAccountName: varchar("income_account_name", { length: 255 }),
    purchaseDesc: text("purchase_desc"),
    purchaseCost: numeric("purchase_cost"),
    expenseAccountValue: varchar("expense_account_value", { length: 50 }),
    expenseAccountName: varchar("expense_account_name", { length: 255 }),
    assetAccountValue: varchar("asset_account_value", { length: 50 }),
    assetAccountName: varchar("asset_account_name", { length: 255 }),
    trackQtyOnHand: boolean("track_qty_on_hand"),
    qtyOnHand: numeric("qty_on_hand"),
    invStartDate: timestamp("inv_start_date"),
    domain: varchar("domain", { length: 10 }),
    sparse: boolean("sparse"),
    syncToken: varchar("sync_token", { length: 50 }),
    metaDataCreateTime: timestamp("meta_data_create_time"),
    metaDataLastUpdatedTime: timestamp("meta_data_last_updated_time"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const quickbooksProductsRelations = relations(
  quickbooksProductsModel,
  ({ one }) => ({
    user: one(usersModel, {
      fields: [quickbooksProductsModel.userId],
      references: [usersModel.id],
    }),
  })
);

