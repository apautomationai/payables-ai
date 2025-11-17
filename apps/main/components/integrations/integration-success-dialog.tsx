"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface IntegrationSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  isSuccess: boolean;
}

export function IntegrationSuccessDialog({
  open,
  onOpenChange,
  message,
  isSuccess,
}: IntegrationSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            {isSuccess ? "Successfully Connected" : "Failed to Connect"}
          </DialogTitle>
          <DialogDescription className="pt-2">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

