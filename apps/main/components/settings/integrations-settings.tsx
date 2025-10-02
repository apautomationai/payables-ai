"use client";

import React, { useState, useEffect, useActionState, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { Settings } from "lucide-react";

type IntegrationStatus =
  | "success"
  | "disconnected"
  | "failed"
  | "not_connected"
  | "paused";

interface Integration {
  name: string;
  path: string;
  category: string;
  allowCollection: boolean;
  status: IntegrationStatus;
  backendName: "gmail" | "outlook" | "quickbooks";
  startReading?: string | null;
}

type ActionState =
  | {
      success?: boolean;
      error?: string;
      message?: string;
    }
  | undefined;

const initialState: ActionState = undefined;

const BACKEND_NAMES_MAP = {
  Gmail: "gmail",
  Outlook: "outlook",
  QuickBooks: "quickbooks",
} as const;

const initialIntegrations: Omit<
  Integration,
  "status" | "backendName" | "startReading"
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
    category: "Accounting & Financial Management",
    allowCollection: false,
  },
];

interface IntegrationsTabProps {
  integrations: any[];
  updateAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  updateStartTimeAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}

export default function IntegrationsTab({
  integrations: initialBackendIntegrations,
  updateAction,
  updateStartTimeAction,
}: IntegrationsTabProps) {
  const integrations: Integration[] = initialIntegrations.map((integration) => {
    const backendName =
      BACKEND_NAMES_MAP[integration.name as keyof typeof BACKEND_NAMES_MAP];
    const existingIntegration = initialBackendIntegrations.find(
      (i: any) => i?.name === backendName
    );

    return {
      ...integration,
      backendName: backendName,
      status: existingIntegration?.status || "not_connected",
      startReading: existingIntegration?.startReading,
    } as Integration;
  });

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
    </div>
  );
}

function SubmitButton({
  label,
  variant,
  disabled,
  name,
  value,
  className,
}: {
  label: string;
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      size="sm"
      type="submit"
      variant={variant}
      disabled={disabled || pending}
      name={name}
      value={value}
      className={cn(className)}
    >
      {pending ? "Loading..." : label}
    </Button>
  );
}

interface IntegrationCardProps {
  integration: Integration;
  updateAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  updateStartTimeAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}

function IntegrationCard({
  integration,
  updateAction,
  updateStartTimeAction,
}: IntegrationCardProps) {
  const {
    name,
    status,
    allowCollection,
    path,
    backendName,
    category,
    startReading,
  } = integration;

  const integrationStatusText =
    {
      success: "Connected",
      disconnected: "Not Connected",
      failed: "Failed",
      not_connected: "Not Connected",
      paused: "Paused",
    }[status] || "Unknown";

  const statusColorClass =
    {
      success: "bg-green-500",
      disconnected: "bg-gray-500",
      failed: "bg-red-500",
      not_connected: "bg-gray-500",
      paused: "bg-yellow-500",
    }[status] || "bg-gray-500";

  const isConnectActionVisible = status !== "success" && status !== "paused";
  const showConfigureButton = status === "success" && !startReading;
  const showStartDate = status === "success" && startReading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <span className={cn("h-2 w-2 rounded-full mr-2", statusColorClass)} />
          <span className="text-sm font-medium">{integrationStatusText}</span>
        </div>

        {showStartDate && startReading && (
          <div className="text-sm text-muted-foreground border-l-2 pl-3 mb-4">
            Start Date:{" "}
            <span className="font-semibold text-primary">
              {format(new Date(startReading), "LLL d, yyyy")}
            </span>
          </div>
        )}

        {/* @ts-ignore */}
        <form action={updateAction} className="flex flex-wrap gap-2">
          <input type="hidden" name="name" value={backendName} />

          {isConnectActionVisible && (
            <>
              {allowCollection ? (
                <Button size="sm" asChild>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${path}`}
                  >
                    Connect
                  </Link>
                </Button>
              ) : (
                <Button size="sm" disabled>
                  Not Allowed
                </Button>
              )}
            </>
          )}

          {status === "success" && (
            <>
              {showConfigureButton && (
                <ConfigureDialog
                  backendName={backendName}
                  updateStartTimeAction={updateStartTimeAction}
                />
              )}
              <SubmitButton
                name="status"
                value="paused"
                label="Pause"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
              />
              <SubmitButton
                name="status"
                value="disconnected"
                label="Disconnect"
                variant="destructive"
                className="text-white"
              />
            </>
          )}

          {status === "paused" && (
            <>
              <SubmitButton
                name="status"
                value="success"
                label="Resume"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20"
              />
              <SubmitButton
                name="status"
                value="disconnected"
                label="Disconnect"
                variant="destructive"
                className="text-white"
              />
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function ConfigureDialog({
  backendName,
  updateStartTimeAction,
}: {
  backendName: string;
  updateStartTimeAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [state, formAction] = useActionState(
    updateStartTimeAction,
    initialState
  );

  const dateString = useMemo(() => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  }, [date]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Start date saved successfully!");
      setIsOpen(false);
      router.refresh();
    }
    if (state?.error) {
      toast.error("Failed to save date", {
        description: state.error,
      });
    }
  }, [state, router]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Start Date</DialogTitle>
          <DialogDescription>
            Select the date from which to start processing emails.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="name" value={backendName} />
          <input type="hidden" name="startTime" value={dateString} />

          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            {!date && (
              <p className="text-sm text-yellow-600 mt-2">
                Please select a date to continue.
              </p>
            )}
          </div>

          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton
              label="Save"
              variant="default"
              disabled={!date}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}