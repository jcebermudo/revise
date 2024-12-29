"use server"

import { db } from "@/db"
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentSession } from "@/server/session"
import { redirect } from "next/navigation"
import { validateLink } from "./link-restrictions"

export async function setLink(username: string): Promise<void> {
    const { user } = await getCurrentSession();
    if (user === null) {
        throw new Error("User not logged in")
    }
    const userId = user.id;
    const { isValid, error, success } = await validateLink(username);
    if (!isValid) {
        console.log(error)
    }
    if(isValid) {
        console.log(success)
        await db.update(userTable).set({username}).where(eq(userTable.id, userId))
        redirect("/topics")
    }
    
}