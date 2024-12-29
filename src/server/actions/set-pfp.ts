"use server"

import { db } from "@/db"
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentSession } from "@/server/session"
import { revalidatePath } from "next/cache"

export default async function setPFP(link: string): Promise<void> {
    const { user } = await getCurrentSession();
    if (user === null) {
        throw new Error("User not logged in")
    }
    const userId = user.id;
    await db.update(userTable).set({profilePicture: link}).where(eq(userTable.id, userId))
    revalidatePath("/setup/create-profile")

}