import { pgTable, serial, text, integer, timestamp, boolean, index } from "drizzle-orm/pg-core";

import type { InferSelectModel } from "drizzle-orm";

export const userTable = pgTable("user", {
	id: serial("id").primaryKey(),
	email: text("email").unique(),
	googleId: text("google_id"),
	username: text("username"),
	emailVerified: boolean("email_verified").default(false),
	passwordHash: text("password_hash"),
	recoveryCode: text("recovery_code"),
	totpKey: text("totp_key"),
}, (table) => {
	return {
  emailIdx: index('email_index').on(table.email),
  };
});

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey().notNull(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull(),
	twoFactorVerified: boolean("two_factor_verified").notNull().default(false),
});

export const emailVerificationRequestTable = pgTable("email_verification_request", {
	id: text("id").notNull().primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	code: text("code").notNull(),
	email: text("email").notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const passwordResetRequestTable = pgTable("password_reset_request", {
	id: text("id").notNull().primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	email: text("email").notNull(),
	code: text("code").notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull(),
	emailVerified: boolean("email_verified").notNull().default(false),
	twoFactorVerified: boolean("two_factor_verified").notNull().default(false),
});

export interface SessionFlags {
	twoFactorVerified: boolean;
}

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable> & SessionFlags;
export type EmailVerificationRequest = InferSelectModel<typeof emailVerificationRequestTable>;
export type PasswordResetRequest = InferSelectModel<typeof passwordResetRequestTable>;