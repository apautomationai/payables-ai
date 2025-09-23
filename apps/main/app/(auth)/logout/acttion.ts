"use server";

import { logout } from "@/lib/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await logout();
  redirect("/sign-in");
}
