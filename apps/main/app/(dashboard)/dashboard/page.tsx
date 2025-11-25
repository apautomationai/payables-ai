import React from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";
import client from "@/lib/fetch-client";
import { ApiResponse, DashboardData, DashboardMetrics } from "@/lib/types";

function getErrorMessage(error: any): string | null {
  const message = error?.error?.message || error?.message || "";
  return typeof message === "string" && message.includes("No integrations found")
    ? "Connect Email in Settings"
    : null;
}

async function DashboardContent() {
  let dashboardData: DashboardData | null = null;
  let integrationError: string | null = null;

  try {
    const dashboardResult = await client.get<ApiResponse<DashboardData>>("api/v1/invoice/dashboard");

    if (dashboardResult?.data) {
      dashboardData = dashboardResult.data;
    }
  } catch (error) {
    integrationError = getErrorMessage(error);
    if (!integrationError) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  const defaultMetrics: DashboardMetrics = {
    invoicesThisMonth: 0,
    pendingThisMonth: 0,
    approvedThisMonth: 0,
    rejectedThisMonth: 0,
    totalOutstanding: 0,
  };

  return (
    <DashboardClient
      initialMetrics={dashboardData?.metrics || defaultMetrics}
      integrationError={integrationError}
    />
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}