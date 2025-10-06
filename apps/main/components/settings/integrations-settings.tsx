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
  CardFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Button, ButtonProps } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import {
  Settings,
  Mail,
  BookUser,
  Power,
  CalendarDays,
  Clock,
  CircleHelp,
  PauseCircle,
  PlayCircle,
} from "lucide-react";

// Helper for logos - replace with your actual logo components or images
const IntegrationLogo = ({ name }: { name: string }) => {
  if (name === "Gmail") return <Mail className="w-8 h-8 text-red-500" />;
  if (name === "Outlook") return <Mail className="w-8 h-8 text-blue-500" />;
  if (name === "QuickBooks") return <BookUser className="w-8 h-8 text-green-600" />;
  return null;
};

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
  createdAt?: string | null;
  lastRead?: string | null;
}

type ActionState = { success?: boolean; error?: string; message?: string } | undefined;
const initialState: ActionState = undefined;

interface SubmitButtonProps {
  label: string;
  variant: ButtonProps["variant"];
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
  children?: React.ReactNode;
  form?: string; // Added to link button to a form
}

interface ConfigureDialogProps {
  backendName: "gmail" | "outlook" | "quickbooks";
  updateStartTimeAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

const BACKEND_NAMES_MAP = {
  Gmail: "gmail",
  Outlook: "outlook",
  QuickBooks: "quickbooks",
} as const;

const initialIntegrations: Omit<Integration, "status" | "backendName" | "startReading" | "createdAt" | "lastRead">[] = [
  { name: "Gmail", path: "google/auth", category: "Email Processing & Automation", allowCollection: true },
  { name: "Outlook", path: "outlook/auth", category: "Email Processing & Automation", allowCollection: false },
  { name: "QuickBooks", path: "quickbooks/auth", category: "Accounting & Bookkeeping", allowCollection: false },
];

interface IntegrationsTabProps {
  integrations: any[];
  updateAction: (formData: FormData) => void;
  updateStartTimeAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function IntegrationsTab({
  integrations: initialBackendIntegrations,
  updateAction,
  updateStartTimeAction,
}: IntegrationsTabProps) {
  const integrations: Integration[] = initialIntegrations.map((integration) => {
    const backendName = BACKEND_NAMES_MAP[integration.name as keyof typeof BACKEND_NAMES_MAP];
    const existingIntegration = initialBackendIntegrations.find((i: any) => i?.name === backendName);
    return {
      ...integration,
      backendName: backendName,
      status: existingIntegration?.status || "not_connected",
      startReading: existingIntegration?.startReading,
      createdAt: existingIntegration?.createdAt,
      lastRead: existingIntegration?.lastRead,
    } as Integration;
  });

  return (
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
  );
}

function SubmitButton({ label, variant, disabled, name, value, className, children, form }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button form={form} size="sm" type="submit" variant={variant} disabled={disabled || pending} name={name} value={value} className={cn(className)}>
      {pending ? "Loading..." : children || label}
    </Button>
  );
}

interface IntegrationCardProps {
  integration: Integration;
  updateAction: (formData: FormData) => void;
  updateStartTimeAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

function IntegrationCard({ integration, updateAction, updateStartTimeAction }: IntegrationCardProps) {
  const { name, status, allowCollection, path, backendName, category, startReading, createdAt, lastRead } = integration;

  const integrationStatusText = { success: "Connected", disconnected: "Not Connected", failed: "Failed", not_connected: "Not Connected", paused: "Paused" }[status] || "Unknown";
  const statusColorClass = { success: "bg-green-500", disconnected: "bg-gray-500", failed: "bg-red-500", not_connected: "bg-gray-500", paused: "bg-yellow-500" }[status] || "bg-gray-500";
  const dateTimeFormat = "LLL d, yyyy 'at' p";

  const isConnected = status === "success" || status === "paused";
  const formId = `form-${backendName}`; // Unique ID for the form

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <IntegrationLogo name={name} />
                <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription>{category}</CardDescription>
                </div>
            </div>
            <div className="flex items-center text-xs font-medium text-muted-foreground pt-1">
              <span className={cn("h-2 w-2 rounded-full mr-2 shrink-0", statusColorClass)} />
              {integrationStatusText}
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {isConnected && (
          <div className="space-y-2.5 text-sm text-muted-foreground border-l-2 pl-4 py-2">
            {createdAt && <div className="flex items-center gap-2"><Power className="h-4 w-4" /> Connected: <span className="font-medium text-primary">{format(new Date(createdAt), dateTimeFormat)}</span></div>}
            {startReading && <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Start Reading: <span className="font-medium text-primary">{format(new Date(startReading), "LLL d, yyyy")}</span></div>}
            {lastRead && <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Last Read: <span className="font-medium text-primary">{format(new Date(lastRead), dateTimeFormat)}</span></div>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form id={formId} action={updateAction} className="flex flex-wrap items-center gap-2 w-full">
          <input type="hidden" name="name" value={backendName} />
          {status === "not_connected" && (
            <>
              {allowCollection ? (
                <Button size="sm" asChild className="w-full">
                  <Link href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${path}`}>Connect Now</Link>
                </Button>
              ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><Button size="sm" disabled className="w-full">Not Allowed <CircleHelp className="h-4 w-4 ml-2" /></Button></TooltipTrigger>
                        <TooltipContent><p>This integration is not enabled for your account yet.</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              )}
            </>
          )}

          {status === "success" && (
            <>
              {!startReading && <ConfigureDialog backendName={backendName} updateStartTimeAction={updateStartTimeAction} />}
              <SubmitButton name="status" value="paused" label="Pause" variant="outline"><PauseCircle className="h-4 w-4 mr-2" /> Pause</SubmitButton>
              <DisconnectDialog backendName={backendName} formId={formId} />
            </>
          )}

          {status === "paused" && (
             <>
              {!startReading && <ConfigureDialog backendName={backendName} updateStartTimeAction={updateStartTimeAction} />}
              <SubmitButton name="status" value="success" label="Resume" variant="outline"><PlayCircle className="h-4 w-4 mr-2 text-green-600" /> Resume</SubmitButton>
              <DisconnectDialog backendName={backendName} formId={formId} />
            </>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}

function ConfigureDialog({ backendName, updateStartTimeAction }: ConfigureDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [state, formAction] = useActionState(updateStartTimeAction, initialState);

  const dateString = useMemo(() => date ? date.toISOString().split("T")[0] : "", [date]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Start date saved successfully!");
      setIsOpen(false);
      router.refresh();
    }
    if (state?.error) toast.error("Failed to save date", { description: state.error });
  }, [state, router]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" /> Configure</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Start Date</DialogTitle>
          <DialogDescription>Select the date from which to start processing data. This can be changed later.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          <input type="hidden" name="name" value={backendName} />
          <input type="hidden" name="startTime" value={dateString} />
          <div className="flex justify-center">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </div>
          {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton label="Save Changes" variant="default" disabled={!date} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DisconnectDialog({ backendName, formId }: { backendName: string; formId: string }) {
    const { pending } = useFormStatus();

    // Explicit classes to ensure red color in both light/dark modes
    const destructiveClasses = "!bg-red-600 !text-white hover:!bg-red-700 dark:!bg-red-700 dark:hover:!bg-red-800";

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" disabled={pending} className={destructiveClasses}>
                    <Power className="h-4 w-4 mr-2" /> Disconnect
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently disconnect your {backendName} account. We will stop processing any new data. You can reconnect at any time.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                         <SubmitButton
                            form={formId}
                            name="status"
                            value="disconnected"
                            label="Disconnect"
                            variant="destructive"
                            className={destructiveClasses}
                         />
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}