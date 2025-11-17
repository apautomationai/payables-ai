"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";
import {
  Power,
  Clock,
  CircleHelp,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import client from "@/lib/axios-client";
import type { Integration } from "./types";
import type { ActionState } from "@/app/(dashboard)/integrations/actions";
import { ConfigureDialog, DisconnectDialog, SubmitButton } from "./integration-dialogs";
import { syncQuickBooksData } from "@/lib/services/quickbooks.service";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { INTEGRATION_LOGOS } from "./integration-constants";
import { IntegrationStatusBadge } from "./integration-status-badge";
import { IntegrationInfoRow } from "./integration-info-row";
import { IntegrationMetadataSection } from "./integration-metadata-section";
import {
  isIntegrationConnected,
  getTokenExpiration,
  formatDate,
} from "./integration-utils";

interface IntegrationCardProps {
  integration: Integration;
  updateAction: (formData: FormData) => void;
  updateStartTimeAction: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  shouldOpenConfigDialog?: boolean;
  onConfigDialogClose?: () => void;
}

export function IntegrationCard({
  integration,
  updateAction,
  updateStartTimeAction,
  shouldOpenConfigDialog,
  onConfigDialogClose,
}: IntegrationCardProps) {
  const {
    name,
    status,
    allowCollection,
    path,
    backendName,
    category,
    createdAt,
    metadata,
    errorMessage,
  } = integration;

  const isConnected = isIntegrationConnected(status);
  const formId = `form-${backendName}`;
  const isGmail = name.toLowerCase() === "gmail";
  const isQuickBooks = name.toLowerCase() === "quickbooks";
  const IntegrationLogo = INTEGRATION_LOGOS[name];
  const [isSyncing, setIsSyncing] = useState(false);

  const tokenExpiresAt = getTokenExpiration(metadata);
  const connectedTime = formatDate(createdAt);

  const handleConnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${path}`;
    try {
      const res: any = await client.get(url);
      window.location.href = res.url;
    } catch (error: unknown) {
      const connectErrorMessage =
        error && typeof error === "object" && "response" in error
          ? ((error.response as any)?.data?.message as string) || "Failed to connect!"
          : "Failed to connect!";
      toast.error(connectErrorMessage);
    }
  };

  const handleSync = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      const result = await syncQuickBooksData();
      toast.success("Sync completed successfully", {
        description: `Products: ${result.data.products.inserted} inserted, ${result.data.products.updated} updated, ${result.data.products.skipped} skipped. Accounts: ${result.data.accounts.inserted} inserted, ${result.data.accounts.updated} updated, ${result.data.accounts.skipped} skipped.`,
      });
    } catch (error: unknown) {
      const syncErrorMessage =
        error && typeof error === "object" && "response" in error
          ? ((error.response as any)?.data?.message as string) || "Failed to sync!"
          : "Failed to sync!";
      toast.error(syncErrorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 w-full h-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {IntegrationLogo && <IntegrationLogo />}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg truncate">{name}</CardTitle>
              <CardDescription className="text-xs sm:text-sm line-clamp-2">{category}</CardDescription>
            </div>
          </div>
          <IntegrationStatusBadge status={status} className="pt-1" />
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-3 p-4 sm:p-6 pt-0">
        {errorMessage && (
          <Alert variant="destructive" className="border-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">Sync Paused</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {isConnected && (
          <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-muted-foreground border-l-2 pl-3 sm:pl-4 py-2">
            <IntegrationInfoRow
              icon={Power}
              label="Connected"
              value={connectedTime}
            />
            <IntegrationInfoRow
              icon={Clock}
              label="Token Expires"
              value={tokenExpiresAt ? formatDate(tokenExpiresAt) : "Never"}
            />
          </div>
        )}

        <IntegrationMetadataSection metadata={metadata} />
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-0">
        <form
          id={formId}
          action={updateAction}
          className="flex flex-wrap items-center gap-2 w-full"
        >
          <input type="hidden" name="name" value={backendName} />

          {allowCollection ? (
            (status === "not_connected" || status === "disconnected") && (
              <Button size="sm" className="w-full cursor-pointer" onClick={handleConnect}>
                Connect Now
              </Button>
            )
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" disabled className="w-full cursor-not-allowed">
                    Not Allowed <CircleHelp className="h-4 w-4 ml-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This integration is not enabled for your account yet.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {status === "success" && (
            <>
              {isGmail && !integration.startReading && (
                <ConfigureDialog
                  backendName={backendName}
                  updateStartTimeAction={updateStartTimeAction}
                  defaultOpen={shouldOpenConfigDialog}
                  onOpenChange={(open) => !open && onConfigDialogClose?.()}
                />
              )}
              {isQuickBooks && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="cursor-pointer"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2" /> Sync
                    </>
                  )}
                </Button>
              )}
              <SubmitButton name="status" value="paused" label="Pause" variant="outline">
                <PauseCircle className="h-4 w-4 mr-2" /> Pause
              </SubmitButton>
              <DisconnectDialog backendName={backendName} formId={formId} />
            </>
          )}

          {status === "paused" && (
            <>
              {isGmail && !integration.startReading && (
                <ConfigureDialog
                  backendName={backendName}
                  updateStartTimeAction={updateStartTimeAction}
                  defaultOpen={shouldOpenConfigDialog}
                  onOpenChange={(open) => !open && onConfigDialogClose?.()}
                />
              )}
              {isQuickBooks && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="cursor-pointer"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2" /> Sync
                    </>
                  )}
                </Button>
              )}
              <SubmitButton name="status" value="success" label="Resume" variant="outline">
                <PlayCircle className="h-4 w-4 mr-2 text-green-600" /> Resume
              </SubmitButton>
              <DisconnectDialog backendName={backendName} formId={formId} />
            </>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}
