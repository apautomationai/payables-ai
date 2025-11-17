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
    <div className={cn("border-t pt-4 mt-4", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-0 h-auto font-normal"
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Metadata</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-2 text-sm">
          {Object.entries(displayMetadata).map(([key, value]) => (
            <div
              key={key}
              className="flex items-start gap-2 py-1 border-b last:border-b-0"
            >
              <span className="font-medium text-muted-foreground min-w-[120px] capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <span className="text-foreground break-words flex-1">
                {renderValue(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

