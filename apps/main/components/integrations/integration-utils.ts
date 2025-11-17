import { format } from "date-fns";
import { DATE_TIME_FORMAT, DATE_FORMAT } from "./integration-constants";

/**
 * Formats a date string to a readable format
 */
export const formatDate = (date: string | null | undefined): string | null => {
  if (!date) return null;
  try {
    return format(new Date(date), DATE_TIME_FORMAT);
  } catch {
    return null;
  }
};

/**
 * Formats a date string to date only format
 */
export const formatDateOnly = (date: string | null | undefined): string | null => {
  if (!date) return null;
  try {
    return format(new Date(date), DATE_FORMAT);
  } catch {
    return null;
  }
};

/**
 * Checks if integration is connected (success or paused)
 */
export const isIntegrationConnected = (status: string): boolean => {
  return status === "success" || status === "paused";
};

/**
 * Gets token expiration date from metadata
 */
export const getTokenExpiration = (metadata?: Record<string, any>): string | null => {
  return metadata?.tokenExpiresAt || null;
};

/**
 * Formats metadata for display
 */
export const formatMetadataForDisplay = (metadata?: Record<string, any>): Record<string, any> => {
  if (!metadata || typeof metadata !== "object") return {};
  
  // Filter out internal/system fields
  const displayMetadata: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    // Skip fields that are displayed elsewhere or are internal
    if (
      key === "tokenExpiresAt" ||
      key === "lastErrorMessage" ||
      key === "startReading" ||
      key === "lastRead"
    ) {
      continue;
    }
    
    // Only include meaningful values
    if (value !== null && value !== undefined && value !== "") {
      displayMetadata[key] = value;
    }
  }
  
  return displayMetadata;
};

