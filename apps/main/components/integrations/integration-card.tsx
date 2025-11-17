"use client";

import React, { useState } from "react";
import { format } from "date-fns";
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
import { cn } from "@workspace/ui/lib/utils";
import {
  Mail,
  BookUser,
  Power,
  CalendarDays,
  Clock,
  CircleHelp,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import client from "@/lib/axios-client";
import type { Integration, IntegrationStatus } from "./types";
import type { ActionState } from "@/app/(dashboard)/integrations/actions";
import { ConfigureDialog, DisconnectDialog, SubmitButton } from "./integration-dialogs";
import { syncQuickBooksData } from "@/lib/services/quickbooks.service";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";

const INTEGRATION_LOGOS: Record<string, React.ComponentType<{ className?: string }>> = {
  Gmail: () => <Mail className="w-8 h-8 text-red-500" />,
  Outlook: () => <Mail className="w-8 h-8 text-blue-500" />,
  QuickBooks: () => <BookUser className="w-8 h-8 text-green-600" />,
};

const STATUS_CONFIG: Record<IntegrationStatus, { text: string; color: string }> = {
  success: { text: "Connected", color: "bg-green-500" },
  disconnected: { text: "Not Connected", color: "bg-gray-500" },
  failed: { text: "Failed", color: "bg-red-500" },
  not_connected: { text: "Not Connected", color: "bg-gray-500" },
  paused: { text: "Paused", color: "bg-yellow-500" },
};

const DATE_TIME_FORMAT = "LLL d, yyyy 'at' p";

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
    startReading,
    createdAt,
    lastRead,
    errorMessage,
    email,
    providerId,
    metadata,
  } =
    integration;

  const { text: statusText, color: statusColor } = STATUS_CONFIG[status as IntegrationStatus] || STATUS_CONFIG.not_connected;
  const isConnected = status === "success" || status === "paused";
  const formId = `form-${backendName}`;
  const isGmail = name.toLowerCase() === "gmail";
  const isQuickBooks = name.toLowerCase() === "quickbooks";
  const IntegrationLogo = INTEGRATION_LOGOS[name];
  const [isSyncing, setIsSyncing] = useState(false);

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
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {IntegrationLogo && <IntegrationLogo />}
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{category}</CardDescription>
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-muted-foreground pt-1">
            <span className={cn("h-2 w-2 rounded-full mr-2 shrink-0", statusColor)} />
            {statusText}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-3">
        {errorMessage && (
          <Alert variant="destructive" className="border-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              Sync Paused
            </AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {isConnected && (
          <div className="space-y-2.5 text-sm text-muted-foreground border-l-2 pl-4 py-2">
            {email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email:{" "}
                <span className="font-medium text-primary">{email}</span>
              </div>
            )}
            {isQuickBooks && metadata?.companyName && (
              <div className="flex items-center gap-2">
                <BookUser className="h-4 w-4" /> Company:{" "}
                <span className="font-medium text-primary">{metadata.companyName}</span>
              </div>
            )}
            {createdAt && (
              <div className="flex items-center gap-2">
                <Power className="h-4 w-4" /> Connected:{" "}
                <span className="font-medium text-primary">
                  {format(new Date(createdAt), DATE_TIME_FORMAT)}
                </span>
              </div>
            )}
            {isGmail && startReading && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Start Reading:{" "}
                <span className="font-medium text-primary">
                  {format(new Date(startReading), "LLL d, yyyy")}
                </span>
              </div>
            )}
            {isGmail && lastRead && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Last Read:{" "}
                <span className="font-medium text-primary">
                  {format(new Date(lastRead), DATE_TIME_FORMAT)}
                </span>
              </div>
            )}
            {metadata?.scopes && Array.isArray(metadata.scopes) && metadata.scopes.length > 0 && (
              <div className="flex items-start gap-2">
                <CircleHelp className="h-4 w-4 mt-0.5" /> Scopes:{" "}
                <span className="font-medium text-primary text-xs">
                  {metadata.scopes.slice(0, 2).join(", ")}
                  {metadata.scopes.length > 2 && ` +${metadata.scopes.length - 2} more`}
                </span>
              </div>
            )}
            {metadata?.tokenExpiresAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Token Expires:{" "}
                <span className="font-medium text-primary">
                  {format(new Date(metadata.tokenExpiresAt), DATE_TIME_FORMAT)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <form id={formId} action={updateAction} className="flex flex-wrap items-center gap-2 w-full">
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
              {isGmail && !startReading && (
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
              {isGmail && !startReading && (
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

