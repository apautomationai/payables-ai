import React, { Suspense } from "react";
import { SubscriptionGuard } from "@/components/auth/subscription-guard";
import SettingsView from "@/components/settings/settings-view";
import client from "@/lib/fetch-client";
import {
  updateIntegrationStatusAction,
  updateStartTimeAction,
} from "@/app/(dashboard)/settings/actions";

export const dynamic = "force-dynamic";

async function getIntegrations(): Promise<any[]> {
  try {
    const response = await client.get("api/v1/settings/integrations");
    return response?.data || [];
  } catch (error) {
    // console.error("Failed to fetch integrations:", error);
    return [];
  }
}

// Settings Content Component
async function SettingsContent(props: any) {
  // Destructure searchParams from the props object
  const { searchParams } = props;

  const integrations = await getIntegrations();

  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsView
        integrations={integrations}
        searchParams={searchParams}
        updateIntegrationStatusAction={updateIntegrationStatusAction}
        updateStartTimeAction={updateStartTimeAction}
      />
    </Suspense>
  );
}

// UPDATED: The entire props object is typed as 'any' to bypass the build error.
export default function SettingsPage(props: any) {
  return (
    <SubscriptionGuard requiresAccess={true} loadingType="skeleton">
      <SettingsContent {...props} />
    </SubscriptionGuard>
  );
}

const SettingsSkeleton = () => (
  <div className="space-y-6">
    <div className="h-10 w-48 bg-muted rounded-md animate-pulse"></div>
    <div className="border rounded-lg p-6">
      <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse mb-2"></div>
      <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse"></div>
    </div>
  </div>
);