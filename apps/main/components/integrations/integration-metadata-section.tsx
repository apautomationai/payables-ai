"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { formatMetadataForDisplay, formatDate } from "./integration-utils";

interface IntegrationMetadataSectionProps {
  metadata?: Record<string, any>;
  className?: string;
}

export function IntegrationMetadataSection({
  metadata,
  className,
}: IntegrationMetadataSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const displayMetadata = formatMetadataForDisplay(metadata);

  // Don't show section if there's no metadata to display
  if (Object.keys(displayMetadata).length === 0) {
    return null;
  }

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      return value.length === 0
        ? "No items"
        : `${value.length} item(s)`;
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className={cn("border-t pt-3 sm:pt-4 mt-3 sm:mt-4", className)}>
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
              <span className="font-medium text-muted-foreground sm:min-w-[120px] capitalize shrink-0">
                {key.replace(/([A-Z])/g, " $1").trim()}:
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

