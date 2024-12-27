"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/session";

export default async function TopicsPage() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }
  if (user.username === null) {
    return redirect("/setup");
  }
}
