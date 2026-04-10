import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import TodoClient from "./TodoClient";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <TodoClient username={session.username} />;
}
