import { userTable } from "./schema";
import { db } from "./schema";
import { eq } from "drizzle-orm";

export async function getUserFromGoogleId(googleUserId: string) {
    const result = await db
        .select()
        .from(userTable)
        .where(eq(userTable.googleId, googleUserId));
    return result[0] || null;
}

export async function createUser(googleUserId: string, username: string) {
    const result = await db
        .insert(userTable)
        .values({
            googleId: googleUserId,
            username: username
        })
        .returning();
    return result[0];
}