import { Google } from "arctic";
import { db } from "@/db/index"
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID || "",
	process.env.GOOGLE_CLIENT_SECRET || "",
	"http://localhost:3000/login/google/callback"
);

export async function getUserFromGoogleId(googleUserId: string): Promise<User> {
    const verify = await db.select().from(userTable).where(eq(userTable.googleId, googleUserId));
    return verify[0] || null
}

export async function createUser(googleId: string, name: string): Promise<User> {
    await db.insert(userTable).values({
        googleId,
        name
    })
    const user = await db.select().from(userTable).where(eq(userTable.googleId, googleId))
    return user[0]
}

interface User {
	id: number;
	googleId: string;
	name: string;
}

