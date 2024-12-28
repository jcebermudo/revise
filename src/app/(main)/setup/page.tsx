"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/session";
import UsernameInput from "./components/username-new";

export default async function SetupPage() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }
  if (user.username !== null) {
    return redirect("/topics");
  }
  return (
    <div>
      <UsernameInput />
    </div>
  );
}
