"use client";

import React from "react";
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

const initialIntegrations = [
  {
    name: "Gmail",
    path: "google/auth",
    category: "Email Processing & Automation",
    allowCollection: true,
  },
  {
    name: "Outlook",
    category: "Email Processing & Automation",
    allowCollection: false,
  },
  {
    name: "QuickBooks",
    category: "Accounting & Financial Management",
    allowCollection: false,
  },

];

export default function IntegrationsTab({
  integrations,
}: {
  integrations: any[];
}) {
  const finalIntegrations = initialIntegrations.map((integration) => {
    const existingIntegration = integrations.find(
      (i: any) => i?.name?.toLowerCase() === integration.name?.toLowerCase()
    );
    console.log("existingIntegration", existingIntegration);
    return {
      ...integration,
      status: existingIntegration?.status || "not_connected",
    };
  });

  console.log("finalIntegrations", finalIntegrations);

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
            {finalIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.name}
                {...integration}
                onConnect={() => {}}
                isPending={false}
              />
            ))}
            {/* <Card className="flex items-center justify-center border-dashed">
              <div className="text-center">
                <PlusCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">Add Integration</h3>
                <p className="mt-1 text-sm text-muted-foreground">Connect a new service</p>
                <Button variant="outline" size="sm" className="mt-4">Browse Integrations</Button>
              </div>
            </Card> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IntegrationCard(integration: any) {
  const integrationStatus =
    integration.status === "success"
      ? "Connected"
      : integration.status === "failed"
        ? "Failed"
        : "Not Connected";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{integration.name}</CardTitle>
        <CardDescription>{integration.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <span
            className={cn(
              "h-2 w-2 rounded-full mr-2",
              integration.status === "success"
                ? "bg-green-500"
                : integration.status === "failed"
                  ? "bg-red-500"
                  : "bg-gray-500"
            )}
          />
          <span className="text-sm font-medium">{integrationStatus}</span>
        </div>
        <div className="flex gap-2">
          {integration?.status?.toLowerCase() !== "success" && (
            <Button
              size="sm"
              asChild
              className={cn("text-white dark:bg-white dark:text-black", !integration.allowCollection && "cursor-not-allowed bg-black/70 hover:bg-black/70")}
              disabled={!integration.allowCollection}
            >
              {integration.allowCollection ? (
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${integration.path}`}
                >
                  Connect
                </Link>
              ) : (
                <span>Not Allowed</span>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
