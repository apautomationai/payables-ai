"use client";

import React from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { AlertTriangle } from "lucide-react";

interface IntegrationConfigAlertProps {
  message: string;
}

export function IntegrationConfigAlert({
  message,
}: IntegrationConfigAlertProps) {
  return (
    <Alert
      variant="destructive"
      className="bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300"
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Configuration Required</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

