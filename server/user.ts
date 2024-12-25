import { db } from "./db";
import { decrypt, decryptToString, encrypt, encryptString } from "./encryption";
import { hashPassword } from "./password";
import { generateRandomRecoveryCode } from "./utils";
import { userTable } from "./schema";
import type { User } from "./schema";
import { and, eq } from "drizzle-orm";

export function verifyUsernameInput(username: string): boolean {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
	const passwordHash = await hashPassword(password);
	const recoveryCode = generateRandomRecoveryCode();
	const encryptedRecoveryCode = encryptString(recoveryCode);
	const encryptedRecoveryCodeBase64 = Buffer.from(encryptedRecoveryCode).toString("base64");

	const row = await db.insert(userTable).values(
		{
			email,
			username,
			passwordHash,
			recoveryCode: encryptedRecoveryCodeBase64
		}
	).returning({ id: userTable.id });

	if (row === null) {
		throw new Error("Unexpected error");
	}
	const user: User = {
		id: row[0].id,
		username,
		email,
		emailVerified: false,
		registered2FA: false,
		googleId: null,
		passwordHash,
		recoveryCode: encryptedRecoveryCodeBase64
	};
	return user;
}

export async function updateUserPassword(userId: number, password: string): Promise<void> {
	const passwordHash = await hashPassword(password);
	await db.update(userTable).set({ passwordHash }).where(eq(userTable.id, userId));
}

export async function updateUserEmailAndSetEmailAsVerified(userId: number, email: string): Promise<void> {
	await db.update(userTable).set({ email, emailVerified: true }).where(eq(userTable.id, userId));
}

export async function setUserAsEmailVerifiedIfEmailMatches(userId: number, email: string): Promise<boolean> {
	const result = await db.update(userTable).set({ emailVerified: true }).where(and(eq(userTable.id, userId), eq(userTable.email, email)));
	return result.rowCount > 0;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
	const row = await db.select({ passwordHash: userTable.passwordHash }).from(userTable).where(eq(userTable.id, userId));
	if (row === null) {
		throw new Error("Invalid user ID");
	}
	if (row[0].passwordHash === null) {
		throw new Error("Invalid user ID");
	}
	return row[0].passwordHash;
}

export async function getUserRecoverCode(userId: number): Promise<string> {
	const row = await db.select({ recoveryCode: userTable.recoveryCode }).from(userTable).where(eq(userTable.id, userId));
	if (row === null) {
		throw new Error("Invalid user ID");
	}
	const encryptedRecoveryCodeBase64 = row[0].recoveryCode;
	if (encryptedRecoveryCodeBase64 === null) {
		throw new Error("Invalid recovery code");
	}
	const encryptedRecoveryCodeBuffer = Buffer.from(encryptedRecoveryCodeBase64, 'base64');
	return decryptToString(encryptedRecoveryCodeBuffer);
}

export async function getUserTOTPKey(userId: number): Promise<Uint8Array | null> {
	const row = await db.select({ totpKey: userTable.totpKey }).from(userTable).where(eq(userTable.id, userId));
	if (row === null) {
		throw new Error("Invalid user ID");
	}
	const encrypted = row[0].totpKey;
	if (encrypted === null) {
		return null;
	}
	return decrypt(encrypted);
}

export function updateUserTOTPKey(userId: number, key: Uint8Array): void {
	const encrypted = encrypt(key);
	db.execute("UPDATE user SET totp_key = ? WHERE id = ?", [encrypted, userId]);
}

export function resetUserRecoveryCode(userId: number): string {
	const recoveryCode = generateRandomRecoveryCode();
	const encrypted = encryptString(recoveryCode);
	db.execute("UPDATE user SET recovery_code = ? WHERE id = ?", [encrypted, userId]);
	return recoveryCode;
}

export function getUserFromEmail(email: string): User | null {
	const row = db.queryOne(
		"SELECT id, email, username, email_verified, IIF(totp_key IS NOT NULL, 1, 0) FROM user WHERE email = ?",
		[email]
	);
	if (row === null) {
		return null;
	}
	const user: User = {
		id: row.number(0),
		email: row.string(1),
		username: row.string(2),
		emailVerified: Boolean(row.number(3)),
		registered2FA: Boolean(row.number(4))
	};
	return user;
}
