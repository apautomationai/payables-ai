import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { usersModel } from "./users.model";

export const quickbooksIntegrationsModel = pgTable("quickbooks_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersModel.id)
    .notNull(),
  companyId: varchar("company_id", { length: 255 }).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenExpiresAt: timestamp("token_expires_at").notNull(),
  realmId: varchar("realm_id", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type QuickBooksIntegration =
  typeof quickbooksIntegrationsModel.$inferSelect;
export type NewQuickBooksIntegration =
  typeof quickbooksIntegrationsModel.$inferInsert;
