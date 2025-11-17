import React from "react";
import { LucideIcon } from "lucide-react";

interface IntegrationInfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  className?: string;
}

export function IntegrationInfoRow({
  icon: Icon,
  label,
  value,
  className,
}: IntegrationInfoRowProps) {
  if (!value) return null;

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className || ""}`}>
      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <span className="text-xs sm:text-sm text-muted-foreground shrink-0">{label}:</span>
      <span className="font-medium text-primary text-xs sm:text-sm break-words min-w-0">{value}</span>
    </div>
  );
}

