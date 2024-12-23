import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/session";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }
  return <h1>Hi, {user.username}!</h1>;
}
