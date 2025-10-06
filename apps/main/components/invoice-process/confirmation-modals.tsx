"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@workspace/ui/components/dialog";
import { InvoiceDetails } from "@/lib/types/invoice";
import { toast } from "sonner";

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const renderValue = (value: string | number | any[] | null | undefined) => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  if (Array.isArray(value)) {
    return value.length === 0 ? "No items" : `${value.length} item(s)`;
  }
  return String(value);
};

interface ConfirmationModalsProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  invoiceDetails: InvoiceDetails;
  selectedFields: string[];
  onSave: () => Promise<void>;
  onReject: () => Promise<void>;
}

export default function ConfirmationModals({
  isEditing,
  setIsEditing,
  invoiceDetails,
  selectedFields,
  onSave,
  onReject,
}: ConfirmationModalsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApproveAndSave = async () => {
    if (!onSave) return;
    try {
      setIsSaving(true);
      await onSave();
      setIsEditing(false);
    } catch (error) {
      // Error toast is handled in the parent component
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    try {
      setIsRejecting(true);
      await onReject();
    } catch (error) {
      // Error toast is handled in the parent
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex justify-between mt-4">
      {isEditing ? (
        <>
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          {/* The "Approve" button is shown when not in edit mode */}
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Approve</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Invoice Approval</DialogTitle>
                  <DialogDescription>
                    These selected fields will be saved and the invoice will be
                    marked as 'Approved'.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-60 overflow-y-auto my-4 pr-2">
                  <div className="grid gap-2 text-sm">
                    {selectedFields.map((key) => (
                      <div
                        key={key}
                        className="grid grid-cols-2 gap-4 items-center"
                      >
                        <span className="text-muted-foreground">
                          {formatLabel(key)}
                        </span>
                        <span className="font-semibold text-right truncate">
                          {renderValue(
                            invoiceDetails[key as keyof InvoiceDetails]
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleApproveAndSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Confirming..." : "Confirm Approval"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
}