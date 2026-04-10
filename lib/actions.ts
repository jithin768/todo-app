"use server";

import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "password";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    await createSession(username);
    redirect("/");
  }

  return { error: "Invalid username or password" };
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
