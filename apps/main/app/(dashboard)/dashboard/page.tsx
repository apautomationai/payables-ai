import React, { Suspense } from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";
import client from "@/lib/fetch-client";
import { ApiResponse, DashboardData, DashboardMetrics } from "@/lib/types";

export const dynamic = 'force-dynamic';

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
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient
        initialMetrics={dashboardData?.metrics || defaultMetrics}
        integrationError={integrationError}
      />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}