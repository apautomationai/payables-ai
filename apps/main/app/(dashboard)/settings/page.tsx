import React, { Suspense } from "react";

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";

import SettingsClient from "@/components/settings/settings-client";
import client from "@/lib/fetch-client";

async function getIntegrations(): Promise<any[]> {
    try { 
      const response = await client.get('api/v1/settings/integrations');
      return response?.data || [];
    } catch (error) {
      return []
    }
}

// This is the main server component for the settings page.
export default async function SettingsPage({searchParams}: {searchParams: any}) {
  const integrations = await getIntegrations();

console.log(integrations)

  const params = await searchParams;
  console.log(params);

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
        <SettingsClient integrations={integrations}/>
      </Suspense>
      {params?.message && (
        <Alert
          variant={params?.type.includes("success") ? "default" : "destructive"}
        >
          <AlertTitle>{params?.type}</AlertTitle>
          <AlertDescription>{params?.message}</AlertDescription>
        </Alert>
      )}
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