"use client";

import React from "react";
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
} from "lucide-react";
import client from "@/lib/axios-client";
import type { Integration, IntegrationStatus } from "./types";
import type { ActionState } from "@/app/(dashboard)/integrations/actions";
import { ConfigureDialog, DisconnectDialog, SubmitButton } from "./integration-dialogs";

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
}

export function IntegrationCard({
  integration,
  updateAction,
  updateStartTimeAction,
}: IntegrationCardProps) {
  const { name, status, allowCollection, path, backendName, category, startReading, createdAt, lastRead } =
    integration;

  const { text: statusText, color: statusColor } = STATUS_CONFIG[status as IntegrationStatus] || STATUS_CONFIG.not_connected;
  const isConnected = status === "success" || status === "paused";
  const formId = `form-${backendName}`;
  const isGmail = name.toLowerCase() === "gmail";
  const IntegrationLogo = INTEGRATION_LOGOS[name];

  const handleConnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${path}`;
    try {
      const res: any = await client.get(url);
      window.location.href = res.url;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? ((error.response as any)?.data?.message as string) || "Failed to connect!"
          : "Failed to connect!";
      toast.error(errorMessage);
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

      <CardContent className="flex-grow">
        {isConnected && (
          <div className="space-y-2.5 text-sm text-muted-foreground border-l-2 pl-4 py-2">
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
                <ConfigureDialog backendName={backendName} updateStartTimeAction={updateStartTimeAction} />
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
                <ConfigureDialog backendName={backendName} updateStartTimeAction={updateStartTimeAction} />
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

