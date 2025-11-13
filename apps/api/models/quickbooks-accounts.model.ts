import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  boolean,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { usersModel } from "./users.model";

export const quickbooksAccountsModel = pgTable(
  "quickbooks_accounts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersModel.id),
    quickbooksId: varchar("quickbooks_id", { length: 50 }).notNull(),
    name: varchar("name", { length: 255 }),
    subAccount: boolean("sub_account"),
    parentRefValue: varchar("parent_ref_value", { length: 50 }),
    fullyQualifiedName: varchar("fully_qualified_name", { length: 255 }),
    active: boolean("active"),
    classification: varchar("classification", { length: 50 }),
    accountType: varchar("account_type", { length: 50 }),
    accountSubType: varchar("account_sub_type", { length: 100 }),
    currentBalance: numeric("current_balance"),
    currentBalanceWithSubAccounts: numeric("current_balance_with_sub_accounts"),
    currencyRefValue: varchar("currency_ref_value", { length: 10 }),
    currencyRefName: varchar("currency_ref_name", { length: 255 }),
    domain: varchar("domain", { length: 10 }),
    sparse: boolean("sparse"),
    syncToken: varchar("sync_token", { length: 50 }),
    metaDataCreateTime: timestamp("meta_data_create_time"),
    metaDataLastUpdatedTime: timestamp("meta_data_last_updated_time"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const quickbooksAccountsRelations = relations(
  quickbooksAccountsModel,
  ({ one }) => ({
    user: one(usersModel, {
      fields: [quickbooksAccountsModel.userId],
      references: [usersModel.id],
    }),
  })
);

