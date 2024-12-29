"use server";

import UploadPFP from "./components/uploadFile";
import { getCurrentSession } from "@/server/session";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

export async function getPfp(): Promise<string> {
  const { user } = await getCurrentSession();
  if (user === null) {
    throw new Error("User not logged in");
  }
  const userId = user.id;
  const pfpLink = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));

  if (pfpLink[0].profilePicture === null) {
    return "/vercel.svg";
  }

  return pfpLink[0].profilePicture;
}

export default async function CreateProfilePage() {
  const pfpLink = await getPfp();
  return (
    <div>
      <h1>Create Profile</h1>
      <Image
        src={pfpLink}
        width={500}
        height={500}
        alt="test"
      />

      <UploadPFP />
    </div>
  );
}
