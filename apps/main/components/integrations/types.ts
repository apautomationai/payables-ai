export type IntegrationStatus =
  | "success"
  | "disconnected"
  | "failed"
  | "not_connected"
  | "paused";

export interface Integration {
  name: string;
  path: string;
  category: string;
  allowCollection: boolean;
  status: IntegrationStatus;
  backendName: "gmail" | "outlook" | "quickbooks";
  startReading?: string | null;
  createdAt?: string | null;
  lastRead?: string | null;
  errorMessage?: string | null;
}

export interface BackendIntegrationData {
  name: string;
  status: IntegrationStatus;
  startReading?: string | null;
  createdAt?: string | null;
  lastRead?: string | null;
  metadata?: {
    lastErrorMessage?: string | null;
    [key: string]: any;
  };
}

