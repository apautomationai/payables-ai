"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import type { Integration } from "./types";
import type { ActionState } from "@/app/(dashboard)/integrations/actions";
import { IntegrationCard } from "./integration-card";

const BACKEND_NAMES_MAP = {
  Gmail: "gmail",
  Outlook: "outlook",
  QuickBooks: "quickbooks",
} as const;

const INITIAL_INTEGRATIONS: Omit<
  Integration,
  "status" | "backendName" | "startReading" | "createdAt" | "lastRead"
>[] = [
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
    category: "Accounting & Bookkeeping",
    allowCollection: true,
  },
];

interface IntegrationsListProps {
  integrations: Array<{
    name: string;
    status: Integration["status"];
    startReading?: string | null;
    createdAt?: string | null;
    lastRead?: string | null;
  }>;
  updateAction: (formData: FormData) => void;
  updateStartTimeAction: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
}

export default function IntegrationsList({
  integrations: initialBackendIntegrations,
  updateAction,
  updateStartTimeAction,
}: IntegrationsListProps) {
  const integrations: Integration[] = INITIAL_INTEGRATIONS.map((integration) => {
    const backendName =
      BACKEND_NAMES_MAP[integration.name as keyof typeof BACKEND_NAMES_MAP];
    const existing = initialBackendIntegrations.find((i) => i?.name === backendName);
    return {
      ...integration,
      backendName,
      status: existing?.status || "not_connected",
      startReading: existing?.startReading,
      createdAt: existing?.createdAt,
      lastRead: existing?.lastRead,
    } as Integration;
  });

  return (
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
              updateStartTimeAction={updateStartTimeAction}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
