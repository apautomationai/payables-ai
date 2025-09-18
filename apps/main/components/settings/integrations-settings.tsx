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
import { PlusCircle } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

// Mock data for integrations
const integrations = [
  {
    name: "QuickBooks",
    category: "Accounting & Financial Management",
    connected: false,
  },
  {
    name: "Gmail",
    category: "Email Processing & Automation",
    connected: false,
  },
  {
    name: "Outlook",
    category: "Email Processing & Automation",
    connected: false,
  },
  {
    name: "AWS Services",
    category: "Textract, S3, Cloud Storage",
    connected: true,
  },
  {
    name: "OpenAI",
    category: "AI-Powered Invoice Processing",
    connected: true,
  },
];

const IntegrationCard = ({
  name,
  category,
  connected,
}: {
  name: string;
  category: string;
  connected: boolean;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{name}</CardTitle>
      <CardDescription>{category}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center mb-4">
        <span
          className={cn(
            "h-2 w-2 rounded-full mr-2",
            connected ? "bg-green-500" : "bg-red-500"
          )}
        />
        <span className="text-sm font-medium">
          {connected ? "Connected" : "Not Connected"}
        </span>
      </div>
      <div className="flex gap-2">
        <Button size="sm">{connected ? "Configure" : "Connect"}</Button>
        {connected && (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
          >
            Disconnect
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function IntegrationsTab() {
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
              <IntegrationCard key={integration.name} {...integration} />
            ))}
            <Card className="flex items-center justify-center border-dashed">
              <div className="text-center">
                <PlusCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">Add Integration</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Connect a new service
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Browse Integrations
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
