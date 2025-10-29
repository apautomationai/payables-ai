"use client";

import React, { useState, useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { AlertTriangle, CheckCircle } from "lucide-react";
import IntegrationsClient from "@/components/integrations/integrations-client";
import type { ActionState } from "@/app/(dashboard)/integrations/actions";

interface IntegrationData {
  name: string;
  status: string;
  startReading?: string | null;
  createdAt?: string | null;
  lastRead?: string | null;
}

interface IntegrationsViewProps {
  integrations: IntegrationData[];
  searchParams: { [key: string]: string | string[] | undefined };
  updateIntegrationStatusAction: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  updateStartTimeAction: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
}

export default function IntegrationsView({
  integrations,
  searchParams,
  updateIntegrationStatusAction,
  updateStartTimeAction,
}: IntegrationsViewProps) {
  const { message, type } = searchParams;
  const [isRedirectDialogOpen, setRedirectDialogOpen] = useState(false);

  // Effect to open the dialog if redirect params are in the URL
  useEffect(() => {
    if (message && type) {
      setRedirectDialogOpen(true);
    }
  }, [message, type]);

  // Logic for the top warning alert
  const needsGmailConfig = integrations.some(
    (i) => i.name === "gmail" && i.status === "success" && !i.startReading,
  );

  const isSuccess =
    String(type).toLowerCase().includes("success") ||
    String(message).toLowerCase().includes("successfully");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Manage your platform configuration and integrations.
        </p>
      </div>

      {/* Top "Configuration Required" Alert */}
      {needsGmailConfig && (
        <Alert
          variant="destructive"
          className="bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            Your Gmail account is connected. Please configure the date from
            which to start processing emails.
          </AlertDescription>
        </Alert>
      )}

      <IntegrationsClient
        integrations={integrations}
        updateAction={updateIntegrationStatusAction}
        updateStartTimeAction={updateStartTimeAction}
      />

      {/* Pop-up Dialog for Redirect Feedback */}
      <Dialog open={isRedirectDialogOpen} onOpenChange={setRedirectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isSuccess ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              {isSuccess ? "Successfully Connected" : "Failed to Connect"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {String(message)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setRedirectDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

