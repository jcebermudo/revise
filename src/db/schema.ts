import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

import type { InferSelectModel } from "drizzle-orm";

export const userTable = pgTable("user", {
	id: serial("id").primaryKey(),
	googleId: text("google_id").notNull(),
	googleName: text("google_name").notNull(),
	email: text("email").notNull(),
	username: text("username").unique(),
	profilePicture: text("profile_picture"),
	pfpCID: text("pfp_cid")
});

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;