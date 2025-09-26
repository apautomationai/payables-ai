"use server";

import { cookies } from "next/headers";

export async function checkSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const userId = cookieStore.get("userId");

  return {
    isLoggedIn: !!token,
    userId: userId?.value || null,
  };
}
