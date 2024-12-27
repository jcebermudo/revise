"use server"
import { db } from "@/db"
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function usernameExists(username: string): Promise<boolean> {
    const results = await db
        .select({ username: userTable.username })
        .from(userTable)
        .where(eq(userTable.username, username));
    
    // SQL queries typically return an empty array if no matches are found
    return results.length > 0;
}