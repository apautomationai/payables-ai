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
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="font-medium text-primary">{value}</span>
    </div>
  );
}

