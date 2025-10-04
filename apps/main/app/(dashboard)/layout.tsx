import React from "react";
import client from "@/lib/fetch-client";
import { User, ApiResponse } from "@/lib/types";
import DashboardClientLayout from "@/components/dashboard/DashboardClientLayout"; // Adjust path if needed

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName = "User";
  let userEmail = "";

  try {
    const userResult = await client.get<ApiResponse<User>>("api/v1/users/me");
    if (userResult.data) {
      const user = userResult.data;
      userName = `${user.firstName} ${user.lastName}`.trim();
      userEmail = user.email;
    }
  } catch (error) {
    console.error("Failed to fetch user data in layout:", error);
  }

  return (
    <DashboardClientLayout userName={userName} userEmail={userEmail}>
      {children}
    </DashboardClientLayout>
  );
}