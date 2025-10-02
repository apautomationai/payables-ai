export type IntegrationStatus = "success" | "disconnected" | "failed" | "not_connected" | "paused";

// Interface for the data sent to the backend to update an integration's status
export interface UpdatedData {
  // CHANGED: Replaced "google" with "gmail" based on your input
  name: "gmail" | "outlook" | "quickbooks"; 
  status: IntegrationStatus;
}

export interface Integration {
    name: string;
    path: string;
    category: string;
    allowCollection: boolean;
    status: IntegrationStatus;
    backendName: 'gmail' | 'outlook' | 'quickbooks';
}