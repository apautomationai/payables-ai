// "use client";

// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@workspace/ui/components/card";
// import { Button } from "@workspace/ui/components/button";
// import { cn } from "@workspace/ui/lib/utils";
// import Link from "next/link";

// const initialIntegrations = [
//   {
//     name: "Gmail",
//     path: "google/auth",
//     category: "Email Processing & Automation",
//     allowCollection: true,
//   },
//   {
//     name: "Outlook",
//     category: "Email Processing & Automation",
//     allowCollection: false,
//   },
//   {
//     name: "QuickBooks",
//     category: "Accounting & Financial Management",
//     allowCollection: false,
//   },

// ];

// export default function IntegrationsTab({
//   integrations,
// }: {
//   integrations: any[];
// }) {
//   const finalIntegrations = initialIntegrations.map((integration) => {
//     const existingIntegration = integrations.find(
//       (i: any) => i?.name?.toLowerCase() === integration.name?.toLowerCase()
//     );
//     console.log("existingIntegration", existingIntegration);
//     return {
//       ...integration,
//       status: existingIntegration?.status || "not_connected",
//     };
//   });

//   console.log("finalIntegrations", finalIntegrations);

//   return (
//     <div className="grid gap-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Third-Party Integrations</CardTitle>
//           <CardDescription>
//             Connect and configure external services and platforms.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {finalIntegrations.map((integration) => (
//               <IntegrationCard
//                 key={integration.name}
//                 {...integration}
//                 onConnect={() => {}}
//                 isPending={false}
//               />
//             ))}
//             {/* <Card className="flex items-center justify-center border-dashed">
//               <div className="text-center">
//                 <PlusCircle className="mx-auto h-8 w-8 text-muted-foreground" />
//                 <h3 className="mt-2 text-sm font-semibold">Add Integration</h3>
//                 <p className="mt-1 text-sm text-muted-foreground">Connect a new service</p>
//                 <Button variant="outline" size="sm" className="mt-4">Browse Integrations</Button>
//               </div>
//             </Card> */}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function IntegrationCard(integration: any) {
//   const integrationStatus =
//     integration.status === "success"
//       ? "Connected"
//       : integration.status === "failed"
//         ? "Failed"
//         : "Not Connected";
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-lg">{integration.name}</CardTitle>
//         <CardDescription>{integration.category}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center mb-4">
//           <span
//             className={cn(
//               "h-2 w-2 rounded-full mr-2",
//               integration.status === "success"
//                 ? "bg-green-500"
//                 : integration.status === "failed"
//                   ? "bg-red-500"
//                   : "bg-gray-500"
//             )}
//           />
//           <span className="text-sm font-medium">{integrationStatus}</span>
//         </div>
//         <div className="flex gap-2">
//           {integration?.status?.toLowerCase() !== "success" && (
//             <Button
//               size="sm"
//               asChild
//               className={cn("text-white dark:bg-white dark:text-black", !integration.allowCollection && "cursor-not-allowed bg-black/70 hover:bg-black/70")}
//               disabled={!integration.allowCollection}
//             >
//               {integration.allowCollection ? (
//                 <Link
//                   href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${integration.path}`}
//                 >
//                   Connect
//                 </Link>
//               ) : (
//                 <span>Not Allowed</span>
//               )}
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

// NOTE: Placeholder types (You must use imports from integration-types.ts)
type IntegrationStatus =
  | "success"
  | "disconnected"
  | "failed"
  | "not_connected"
  | "paused";
interface Integration {
  name: string;
  path: string;
  category: string;
  allowCollection: boolean;
  status: IntegrationStatus;
  backendName: "gmail" | "outlook" | "quickbooks";
}

// Type for the state managed by useActionState, passed from parent
type ActionState = {
  success?: boolean;
  error?: string;
} | undefined;

const BACKEND_NAMES_MAP = {
  Gmail: "gmail",
  Outlook: "outlook",
  QuickBooks: "quickbooks",
} as const;

const initialIntegrations: Omit<Integration, "status" | "backendName">[] = [
  {
    name: "Gmail",
    path: "google/auth",
    category: "Email Processing & Automation",
    allowCollection: true,
  },
  {
    name: "Outlook",
    path: "outlook/auth",
    category: "Email Processing & Automation",
    allowCollection: false,
  },
  {
    name: "QuickBooks",
    path: "quickbooks/auth",
    category: "Accounting & Financial Management",
    allowCollection: false,
  },
];

interface IntegrationsTabProps {
  integrations: any[];
  // Action now needs to match the signature required by useActionState
  updateAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}

export default function IntegrationsTab({
  integrations: initialBackendIntegrations,
  updateAction,
}: IntegrationsTabProps) {
  // Combine initial client definition with server status
  const integrations: Integration[] = initialIntegrations.map((integration) => {
    const backendName =
      BACKEND_NAMES_MAP[integration.name as keyof typeof BACKEND_NAMES_MAP];
    const existingIntegration = initialBackendIntegrations.find(
      (i: any) =>
        i?.name?.toLowerCase() === backendName ||
        i?.name?.toLowerCase() === integration.name.toLowerCase()
    );

    return {
      ...integration,
      backendName: backendName,
      status: existingIntegration?.status || "not_connected",
    } as Integration;
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Third-Party Integrations</CardTitle>
          <CardDescription>
            Connect and configure external services and platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.name}
                integration={integration}
                updateAction={updateAction}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==============================================================================
// Helper component to show a loading state for form submissions
function SubmitButton({
  label,
  variant,
  disabled,
  name,
  value,
}: {
  label: string;
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  const isLoading = pending;

  return (
    <Button
      size="sm"
      type="submit"
      variant={variant}
      disabled={disabled || isLoading}
      name={name}
      value={value}
    >
      {isLoading ? "Loading..." : label}
    </Button>
  );
}

interface IntegrationCardProps {
  integration: Integration;
  updateAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}

function IntegrationCard({ integration, updateAction }: IntegrationCardProps) {
  const { name, status, allowCollection, path, backendName, category } =
    integration;

  const integrationStatusText =
    {
      success: "Connected",
      disconnected: "Not Connected",
      failed: "Failed",
      not_connected: "Not Connected",
      paused: "Paused",
    }[status] || "Unknown";

  const statusColorClass =
    {
      success: "bg-green-500",
      disconnected: "bg-gray-500",
      failed: "bg-red-500",
      not_connected: "bg-gray-500",
      paused: "bg-yellow-500",
    }[status] || "bg-gray-500";

  const isConnectActionVisible = status !== "success" && status !== "paused";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <span className={cn("h-2 w-2 rounded-full mr-2", statusColorClass)} />
          <span className="text-sm font-medium">{integrationStatusText}</span>
        </div>

       {/* @ts-ignore */}
        <form action={updateAction} className="flex gap-2">
          {/* This hidden input identifies which integration the action is for */}
          <input type="hidden" name="name" value={backendName} />

          {isConnectActionVisible && (
            <>
              {allowCollection ? (
                status === "not_connected" ? (
                  <Button
                    size="sm"
                    asChild
                    className="text-white dark:bg-white dark:text-black"
                  >
                    <Link
                      href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${path}`}
                    >
                      Connect
                    </Link>
                  </Button>
                ) : (
                  <SubmitButton
                    name="status"
                    value="success"
                    label={
                      status === "failed" || status === "disconnected"
                        ? "Reconnect"
                        : "Connect"
                    }
                    variant="default"
                  />
                )
              ) : (
                <Button
                  size="sm"
                  disabled
                  className="cursor-not-allowed bg-black/70 hover:bg-black/70"
                >
                  Not Allowed
                </Button>
              )}
            </>
          )}

          {status === "success" && (
            <>
              <SubmitButton
                name="status"
                value="paused"
                label="Pause"
                variant="outline"
              />
              <SubmitButton
                name="status"
                value="disconnected"
                label="Disconnect"
                variant="destructive"
              />
            </>
          )}

          {status === "paused" && (
            <>
              <SubmitButton
                name="status"
                value="success"
                label="Resume"
                variant="default"
              />
              <SubmitButton
                name="status"
                value="disconnected"
                label="Disconnect"
                variant="destructive"
              />
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}