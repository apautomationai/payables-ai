import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { STATUS_CONFIG } from "./integration-constants";
import type { IntegrationStatus } from "./types";

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus | string;
  className?: string;
}

export function IntegrationStatusBadge({
  status,
  className,
}: IntegrationStatusBadgeProps) {
  const { text, color } =
    STATUS_CONFIG[status as IntegrationStatus] || STATUS_CONFIG.not_connected;

  return (
    <div
      className={cn(
        "flex items-center text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full mr-2 shrink-0", color)} />
      {text}
    </div>
  );
}

