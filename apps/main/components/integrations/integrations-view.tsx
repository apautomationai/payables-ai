"use client";

import React, { useState, useEffect, useActionState } from "react";
import { toast } from "sonner";
import IntegrationsList from "./integrations-list";
import type { ActionState } from "@/app/(dashboard)/integrations/actions";
import type { IntegrationStatus } from "./types";
import { IntegrationSuccessDialog } from "./integration-success-dialog";
import { IntegrationConfigAlert } from "./integration-config-alert";

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

  const isSuccess =
    String(type).toLowerCase().includes("success") ||
    String(message).toLowerCase().includes("successfully");
  const isGmail = String(type).toLowerCase().includes("gmail") ||
    String(message).toLowerCase().includes("gmail");

  const needsGmailConfig = integrations.some(
    (i) => i.name === "gmail" && i.status === "success" && !i.startReading,
  );

  useEffect(() => {
    if (message && type) {
      // Check if this is a successful Gmail integration that needs configuration
      if (isSuccess && isGmail) {
        const gmailIntegration = integrations.find((i) => i.name === "gmail");
        if (
          gmailIntegration &&
          gmailIntegration.status === "success" &&
          !gmailIntegration.startReading
        ) {
          // Directly open configure dialog, skip success message
          setShouldOpenGmailConfig(true);
          return;
        }
      }

      // Show success/error dialog for non-Gmail or already configured
      setRedirectDialogOpen(true);
    }
  }, [message, type, integrations, isSuccess, isGmail]);

  useEffect(() => {
    if (!state) return;
    if (state.error) {
      toast.error("An error occurred", { description: state.error });
    } else if (state.success) {
      toast.success(state.message || "Action successful!");
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage your platform configuration and integrations.
        </p>
      </div>

      {needsGmailConfig && (
        <IntegrationConfigAlert
          message="Your Gmail account is connected. Please configure the date from which to start processing emails."
        />
      )}

      <IntegrationsList
        integrations={integrations as Array<{
          name: string;
          status: IntegrationStatus;
          startReading?: string | null;
          createdAt?: string | null;
          lastRead?: string | null;
          email?: string | null;
          providerId?: string | null;
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

      {message && (
        <IntegrationSuccessDialog
          open={isRedirectDialogOpen}
          onOpenChange={setRedirectDialogOpen}
          message={String(message)}
          isSuccess={isSuccess}
        />
      )}
    </div>
  );
}
