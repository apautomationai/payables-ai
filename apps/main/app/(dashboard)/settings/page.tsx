// import React, { Suspense } from "react";
// import SettingsView from "@/components/settings/settings-view";
// import client from "@/lib/fetch-client";
// import {
//   updateIntegrationStatusAction,
//   updateStartTimeAction,
// } from "@/app/(dashboard)/settings/actions";

// export const dynamic = "force-dynamic";

// // Data fetching is done on the server
// async function getIntegrations(): Promise<any[]> {
//   try {
//     const response = await client.get("api/v1/settings/integrations");
//     return response?.data || [];
//   } catch (error) {
//     console.error("Failed to fetch integrations:", error);
//     return [];
//   }
// }

// interface ResolvedSearchParams {
//   [key: string]: string | string[] | undefined;
// }

// // This is the clean Server Component
// export default async function SettingsPage({
//   searchParams,
// }: {
//   searchParams: ResolvedSearchParams;
// }) {
//   // Fetch data directly on the server before rendering
//   const integrations = await getIntegrations();

//   return (
//     <Suspense fallback={<SettingsSkeleton />}>
//       {/* Pass the server-fetched data and actions as props to the client component */}
//       <SettingsView
//         integrations={integrations}
//         searchParams={searchParams}
//         updateIntegrationStatusAction={updateIntegrationStatusAction}
//         updateStartTimeAction={updateStartTimeAction}
//       />
//     </Suspense>
//   );
// }

// const SettingsSkeleton = () => (
//   <div className="space-y-6">
//     <div className="h-10 w-48 bg-muted rounded-md animate-pulse"></div>
//     <div className="border rounded-lg p-6">
//       <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse mb-2"></div>
//       <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse"></div>
//     </div>
//   </div>
// );

import React, { Suspense } from "react";
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
    console.error("Failed to fetch integrations:", error);
    return [];
  }
}

interface ResolvedSearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: ResolvedSearchParams;
}) {
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

const SettingsSkeleton = () => (
  <div className="space-y-6">
    <div className="h-10 w-48 bg-muted rounded-md animate-pulse"></div>
    <div className="border rounded-lg p-6">
      <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse mb-2"></div>
      <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse"></div>
    </div>
  </div>
);