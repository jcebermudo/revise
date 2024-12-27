"use server"

import { db } from "@/db"
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentSession } from "@/server/session"
import { redirect } from "next/navigation"

export async function setUsername(username: string): Promise<void> {
    const { user } = await getCurrentSession();
    if (user === null) {
        throw new Error("User not logged in")
    }
    const userId = user.id;
    await db.update(userTable).set({username}).where(eq(userTable.id, userId))
    redirect("/topics")
}