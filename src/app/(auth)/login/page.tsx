import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/session";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (user !== null) {
    return redirect("/topics");
  }
  return (
    <>
      <h1>Sign in</h1>
      <a href="/login/google">Sign in with Google</a>
    </>
  );
}
