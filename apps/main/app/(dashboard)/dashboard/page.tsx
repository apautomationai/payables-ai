import React from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";
import client from "@/lib/fetch-client"; // Adjust this path if your client is elsewhere
import { User, Attachment, ApiResponse } from "@/lib/types"; // Adjust this path to your types file

export default async function DashboardPage() {
  let userName = "User";
  let attachments: Attachment[] = [];
  let integrationError: string | null = null;

  try {
    const [userResult, attachmentsResult] = await Promise.allSettled([
      client.get<ApiResponse<User>>("api/v1/users/me"),
      client.get<ApiResponse<Attachment[]>>("api/v1/google/attachments"),
    ]);

    if (userResult.status === "fulfilled" && userResult.value?.data) {
      const user = userResult.value.data;
      userName = `${user.firstName} ${user.lastName}`.trim();
    } else if (userResult.status === "rejected") {
      const errorReason = userResult.reason as any;
      const errorMessage =
        errorReason?.error?.message && typeof errorReason.error.message === "string"
          ? errorReason.error.message
          : "";

      if (errorMessage.includes("No integrations found for this user")) {
        integrationError = "Connect Email in Settings";
      } else {
        console.error("Failed to fetch user data:", userResult.reason);
      }
    }

    if (attachmentsResult.status === "fulfilled" && attachmentsResult.value?.data) {
      attachments = attachmentsResult.value.data;
    } else if (attachmentsResult.status === "rejected") {
      const errorReason = attachmentsResult.reason as any;
      const errorMessage =
        errorReason?.error?.message && typeof errorReason.error.message === "string"
          ? errorReason.error.message
          : "";
      
      if (errorMessage.includes("No integrations found for this user")) {
        integrationError = "Connect Email in Settings";
      } else {
        console.error("Failed to fetch attachments:", attachmentsResult.reason);
      }
    }
  } catch (error) {
    console.error("An unexpected error occurred while fetching dashboard data:", error);
  }

  return <DashboardClient userName={userName} attachments={attachments} integrationError={integrationError} />;
}

