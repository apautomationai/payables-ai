import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersModel } from "./users.model";

export const statusEnum = pgEnum("status", [
  "success",
  "failed",
  "not_connected",
  "disconnected",
  "paused"
]);

export const integrationsModel = pgTable("integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  status: statusEnum("status").notNull().default("not_connected"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenType: text("token_type"),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastRead: timestamp("last_read").defaultNow(),
});

export const integrationsRelations = relations(
  integrationsModel,
  ({ one }) => ({
    user: one(usersModel, {
      fields: [integrationsModel.userId],
      references: [usersModel.id],
    }),
  })
);
