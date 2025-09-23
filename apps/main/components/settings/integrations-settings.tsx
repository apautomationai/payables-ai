"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { getGoogleOauthUrl } from "@/components/google-callback/actions";
import { toast } from "sonner";

const initialIntegrations = [
  { name: "QuickBooks", category: "Accounting & Financial Management", connected: false },
  { name: "Gmail", category: "Email Processing & Automation", connected: false },
  { name: "Outlook", category: "Email Processing & Automation", connected: false },
  // { name: "AWS Services", category: "Textract, S3, Cloud Storage", connected: true },
  // { name: "OpenAI", category: "AI-Powered Invoice Processing", connected: true },
];

const IntegrationCard = ({ name, category, connected, onConnect, isPending }: {
  name: string; category: string; connected: boolean; onConnect: () => void; isPending: boolean;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{name}</CardTitle>
      <CardDescription>{category}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center mb-4">
        <span className={cn("h-2 w-2 rounded-full mr-2", connected ? "bg-green-500" : "bg-red-500")} />
        <span className="text-sm font-medium">{connected ? "Connected" : "Not Connected"}</span>
      </div>
      <div className="flex gap-2">
        {connected ? (
          <>
            <Button size="sm">Configure</Button>
            <Button size="sm" variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive">Disconnect</Button>
          </>
        ) : (
          <Button size="sm" onClick={onConnect} disabled={isPending && name === "Gmail"}>
            {isPending && name === "Gmail" ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</> ) : ( "Connect" )}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function IntegrationsTab() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // This effect runs when the user is redirected back from the backend.
    const refreshToken = searchParams.get("refresh_token");
    const error = searchParams.get("error");

    if (refreshToken) {
      // This is the key change: Store the token and update the UI.
      localStorage.setItem("google_refresh_token", refreshToken);
      toast.success("Gmail connected successfully!");
      setIntegrations(prev => prev.map(int => int.name === "Gmail" ? { ...int, connected: true } : int));
      // Clean the URL to prevent this from running again on refresh.
      router.replace('/settings');
    } else if (error) {
      toast.error("Gmail Connection Failed", { description: `Error: ${error}. Please try again.` });
      router.replace('/settings');
    }
  }, [searchParams, router]);

  // Check for an existing token on initial component load
  useEffect(() => {
    const storedToken = localStorage.getItem("google_refresh_token");
    if (storedToken) {
        setIntegrations(prev => prev.map(int => int.name === "Gmail" ? { ...int, connected: true } : int));
    }
  }, []);

  const handleConnectGmail = () => {
    startTransition(async () => {
      const result = await getGoogleOauthUrl();
      if (result?.error) {
        toast.error("Connection Failed", { description: result.error });
      }
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Third-Party Integrations</CardTitle>
          <CardDescription>Connect and configure external services and platforms.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.name}
                {...integration}
                onConnect={integration.name === "Gmail" ? handleConnectGmail : () => {}}
                isPending={isPending}
              />
            ))}
            <Card className="flex items-center justify-center border-dashed">
              <div className="text-center">
                <PlusCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">Add Integration</h3>
                <p className="mt-1 text-sm text-muted-foreground">Connect a new service</p>
                <Button variant="outline" size="sm" className="mt-4">Browse Integrations</Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

