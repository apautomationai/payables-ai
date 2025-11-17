"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { formatDate } from "./integration-utils";

interface IntegrationMetadataSectionProps {
  metadata?: Record<string, any>;
  className?: string;
}

/**
 * Formats a key to uppercase with spaces between words
 */
const formatKeyToUppercase = (key: string): string => {
  // Convert camelCase/PascalCase to UPPERCASE with spaces
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .trim()
    // .toUpperCase();
};

/**
 * Checks if a value should be displayed (not null, undefined, or empty string)
 */
const hasValue = (value: any): boolean => {
  if (value === null || value === undefined || value === "") {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return false;
  }
  return true;
};

export function IntegrationMetadataSection({
  metadata,
  className,
}: IntegrationMetadataSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  // Filter metadata to only include fields with values
  const displayMetadata: Record<string, any> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (hasValue(value)) {
      displayMetadata[key] = value;
    }
  }

  // Don't show section if there's no metadata to display
  if (Object.keys(displayMetadata).length === 0) {
    return null;
  }

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      if (value.length === 0) return "No items";
      // For arrays, show first few items or count
      if (value.length <= 3) {
        return value.join(", ");
      }
      return `${value.slice(0, 3).join(", ")} ... (+${value.length - 3} more)`;
    }
    if (typeof value === "object") {
      // For nested objects, show as formatted JSON
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    // Check if it's a date string
    if (typeof value === "string") {
      const dateValue = formatDate(value);
      if (dateValue) {
        return dateValue;
      }
    }
    return String(value);
  };

  return (
    <div className={cn("border-t pt-2 sm:pt-3 mt-2 sm:mt-3", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-0 h-auto font-normal"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <span className="text-xs sm:text-sm text-muted-foreground">Metadata</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        )}
      </Button>

      {isExpanded && (
        <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          {Object.entries(displayMetadata).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2 py-1 border-b last:border-b-0"
            >
              <span className="font-medium text-muted-foreground sm:min-w-[120px] shrink-0 capitalize">
                {formatKeyToUppercase(key)}:
              </span>
              <span className="text-foreground break-words flex-1 min-w-0">
                {renderValue(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

