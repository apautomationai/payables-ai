import { relations } from "drizzle-orm/relations";
import { users, subscriptions } from "./schema";

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	subscriptions: many(subscriptions),
}));