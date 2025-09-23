import React, { Suspense } from "react";
import SettingsClient from "@/components/settings/settings-client";

// This is the main server component for the settings page.
export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your platform configuration and integrations.
        </p>
      </div>
      {/* This Suspense boundary is crucial for child components that use useSearchParams */}
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsClient />
      </Suspense>
    </div>
  );
}

// A simple skeleton loader to show while the settings page is loading.
const SettingsSkeleton = () => (
    <div className="space-y-6">
        <div className="h-10 w-48 bg-muted rounded-md animate-pulse"></div>
        <div className="border rounded-lg p-6">
            <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse"></div>
        </div>
    </div>
);