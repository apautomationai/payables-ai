import React from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { SubscriptionGuard } from "@/components/auth/subscription-guard";
import client from "@/lib/fetch-client";
import { User, ApiResponse, DashboardData, DashboardMetrics } from "@/lib/types";

async function DashboardContent() {
  let userName = "User";
  let dashboardData: DashboardData | null = null;
  let integrationError: string | null = null;

  try {
    const [userResult, dashboardResult] = await Promise.allSettled([
      client.get<ApiResponse<User>>("api/v1/users/me"),
      client.get<ApiResponse<DashboardData>>("api/v1/invoice/dashboard"),
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

    if (dashboardResult.status === "fulfilled" && dashboardResult.value?.data) {
      dashboardData = dashboardResult.value.data;
    } else if (dashboardResult.status === "rejected") {
      const errorReason = dashboardResult.reason as any;
      const errorMessage =
        errorReason?.error?.message && typeof errorReason.error.message === "string"
          ? errorReason.error.message
          : "";

      if (errorMessage.includes("No integrations found for this user")) {
        integrationError = "Connect Email in Settings";
      } else {
        console.error("Failed to fetch dashboard data:", dashboardResult.reason);
      }
    }
  } catch (error) {
    console.error("An unexpected error occurred while fetching dashboard data:", error);
  }

  // Provide fallback values
  const defaultMetrics: DashboardMetrics = {
    invoicesThisMonth: 0,
    pendingThisMonth: 0,
    approvedThisMonth: 0,
    rejectedThisMonth: 0,
    totalOutstanding: 0,
  };

  return (
    <DashboardClient
      userName={userName}
      invoices={dashboardData?.recentInvoices || []}
      metrics={dashboardData?.metrics || defaultMetrics}
      integrationError={integrationError}
    />
  );
}

export default function DashboardPage() {
  return (
    <SubscriptionGuard requiresAccess={true}>
      <DashboardContent />
    </SubscriptionGuard>
  );
}