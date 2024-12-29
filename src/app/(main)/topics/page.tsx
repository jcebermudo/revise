"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/session";
import TopicButton from "./components/topicButton";

export default async function TopicsPage() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }
  if (user.username === null) {
    return redirect("/setup/create-link");
  }
  return (
    <>
      <h1>Topics</h1>
      <TopicButton></TopicButton>
    </>
  )
}
