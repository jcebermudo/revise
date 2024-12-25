import { generateRandomOTP } from "./utils";
import { db } from "./db";
import { ExpiringTokenBucket } from "./rate-limit";
import { encodeBase32 } from "@oslojs/encoding";
import { cookies } from "next/headers";
import { getCurrentSession } from "./session";
import { emailVerificationRequestTable, type EmailVerificationRequest } from "./schema"
import { eq, and } from "drizzle-orm";

export async function getUserEmailVerificationRequest(userId: number, id: string): Promise<EmailVerificationRequest | null> {
    const result = await db.select({
        id: emailVerificationRequestTable.id,
        userId: emailVerificationRequestTable.userId,
        code: emailVerificationRequestTable.code,
        email: emailVerificationRequestTable.email,
        expiresAt: emailVerificationRequestTable.expiresAt
    }).from(emailVerificationRequestTable).where(
  and(
    eq(emailVerificationRequestTable.id, id),
    eq(emailVerificationRequestTable.userId, userId)
  )
);
    if (result === null) {
        return result;
    }


const request: EmailVerificationRequest = {
		id: result[0].id,
		userId: result[0].userId,
		code: result[0].code,
		email: result[0].email,
		expiresAt: new Date(result[0].expiresAt.getTime() * 1000)
	};
   return request;
}

export async function createEmailVerificationRequest(userId: number, email: string): Promise<EmailVerificationRequest | null> {
	await deleteUserEmailVerificationRequest(userId);
	const idBytes = new Uint8Array(20);
	crypto.getRandomValues(idBytes);
	const id = encodeBase32(idBytes).toLowerCase();

	const code = generateRandomOTP();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	
    await db
  .insert(emailVerificationRequestTable)
  .values({
    id,
    userId,
    code,
    email,
	expiresAt
  })
  .returning({ id: emailVerificationRequestTable.id });

   
	const request: EmailVerificationRequest = {
		id,
		userId,
		code,
		email,
		expiresAt
	};
	return request;
}

export async function deleteUserEmailVerificationRequest(userId: number): Promise<void> {
    await db.delete(emailVerificationRequestTable).where(eq(emailVerificationRequestTable.userId, userId));
}

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
	console.log(`To ${email}: Your verification code is ${code}`);
}

export async function setEmailVerificationRequestCookie(request: EmailVerificationRequest): Promise<void> {
	(await cookies()).set("email_verification", request.id, {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: request.expiresAt
	});
}

export async function deleteEmailVerificationRequestCookie(): Promise<void> {
	(await cookies()).set("email_verification", "", {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0
	});
}

export async function getUserEmailVerificationRequestFromRequest(): Promise<EmailVerificationRequest | null> {
	const { user } = await getCurrentSession();
	if (user === null) {
		return null;
	}
	const id = (await cookies()).get("email_verification")?.value ?? null;
	if (id === null) {
		return null;
	}
	const request = await getUserEmailVerificationRequest(user.id, id);
	if (request === null) {
		await deleteEmailVerificationRequestCookie();
	}
	return request;
}

export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(3, 60 * 10);
