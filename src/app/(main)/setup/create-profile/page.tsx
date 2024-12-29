"use server";

import UploadPFP from "./components/uploadFile";
import { getCurrentSession } from "@/server/session";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

const { user } = await getCurrentSession();

export async function getPfp(): Promise<string> {
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
  if (user === null) {
    throw new Error("User not logged in");
  }
  const pfpLink = await getPfp();
  return (
    <div>
      <h1>Create Profile</h1>
      <Image src={pfpLink} alt="Profile Picture" width={200} height={200} />
      <UploadPFP />
    </div>
  );
}
