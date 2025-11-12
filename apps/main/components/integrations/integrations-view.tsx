"use client";

import React, { useState, useEffect, useActionState } from "react";
import { toast } from "sonner";
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
import IntegrationsList from "./integrations-list";
import type { ActionState } from "@/app/(dashboard)/integrations/actions";

import type { IntegrationStatus } from "./types";

interface IntegrationData {
  name: string;
  status: IntegrationStatus | string;
  startReading?: string | null;
  createdAt?: string | null;
  lastRead?: string | null;
  metadata?: {
    lastErrorMessage?: string | null;
    [key: string]: any;
  };
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
  const [shouldOpenGmailConfig, setShouldOpenGmailConfig] = useState(false);
  const [state, formAction] = useActionState(updateIntegrationStatusAction, undefined);

  useEffect(() => {
    if (message && type) {
      // Check if this is a successful Gmail integration
      const isSuccess = String(type).toLowerCase().includes("success") ||
        String(message).toLowerCase().includes("successfully");
      const isGmail = String(type).toLowerCase().includes("gmail") ||
        String(message).toLowerCase().includes("gmail");

      if (isSuccess && isGmail) {
        // Check if Gmail needs configuration
        const gmailIntegration = integrations.find(i => i.name === "gmail");
        if (gmailIntegration && gmailIntegration.status === "success" && !gmailIntegration.startReading) {
          // Directly open configure dialog, skip success message
          setShouldOpenGmailConfig(true);
          return;
        }
      }

      // Show success/error dialog for non-Gmail or already configured
      setRedirectDialogOpen(true);
    }
  }, [message, type, integrations]);

  useEffect(() => {
    if (!state) return;
    if (state.error) {
      toast.error("An error occurred", { description: state.error });
    } else if (state.success) {
      toast.success(state.message || "Action successful!");
    }
  }, [state]);

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

      <IntegrationsList
        integrations={integrations as Array<{
          name: string;
          status: IntegrationStatus;
          startReading?: string | null;
          createdAt?: string | null;
          lastRead?: string | null;
          metadata?: {
            lastErrorMessage?: string | null;
            [key: string]: any;
          };
        }>}
        updateAction={formAction}
        updateStartTimeAction={updateStartTimeAction}
        shouldOpenGmailConfig={shouldOpenGmailConfig}
        onGmailConfigClose={() => setShouldOpenGmailConfig(false)}
      />

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
