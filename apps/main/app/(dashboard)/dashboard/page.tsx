import React from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

// This is the main server component for the dashboard.
// It fetches the user's session data on the server.
export default async function DashboardPage() {
  const session = await getSession();

  // Although the middleware protects this page, this is an extra layer of security.
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Use the user's first name, or "User" as a fallback.
  const userName = session.user.firstName || "User";

  return <DashboardClient userName={userName} />;
}

