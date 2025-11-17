import React from "react";
import { Mail, BookUser } from "lucide-react";
import type { IntegrationStatus } from "./types";

export const INTEGRATION_LOGOS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Gmail: () => <Mail className="w-8 h-8 text-red-500" />,
  Outlook: () => <Mail className="w-8 h-8 text-blue-500" />,
  QuickBooks: () => <BookUser className="w-8 h-8 text-green-600" />,
};

export const STATUS_CONFIG: Record<
  IntegrationStatus,
  { text: string; color: string }
> = {
  success: { text: "Connected", color: "bg-green-500" },
  disconnected: { text: "Not Connected", color: "bg-gray-500" },
  failed: { text: "Failed", color: "bg-red-500" },
  not_connected: { text: "Not Connected", color: "bg-gray-500" },
  paused: { text: "Paused", color: "bg-yellow-500" },
};

export const DATE_TIME_FORMAT = "LLL d, yyyy 'at' p";
export const DATE_FORMAT = "LLL d, yyyy";

export const BACKEND_NAMES_MAP = {
  Gmail: "gmail",
  Outlook: "outlook",
  QuickBooks: "quickbooks",
} as const;

