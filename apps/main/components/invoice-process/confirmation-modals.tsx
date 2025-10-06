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
import { formatLabel, renderValue } from "@/lib/utility/formatters";

interface ConfirmationModalsProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  invoiceDetails: InvoiceDetails;
  selectedFields: string[];
  onSave: () => Promise<void>;
  onReject: () => Promise<void>;
  onApprove: () => Promise<void>;
  onCancel: () => void;
}

export default function ConfirmationModals({
  isEditing,
  setIsEditing,
  invoiceDetails,
  selectedFields,
  onSave,
  onReject,
  onApprove,
  onCancel,
}: ConfirmationModalsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  const handleConfirmApproval = async () => {
    setIsApproving(true);
    await onApprove();
    setIsApproving(false);
  };

  const handleReject = async () => {
    setIsRejecting(true);
    await onReject();
    setIsRejecting(false);
  };

  return (
    <div className="flex justify-between mt-4">
      {isEditing ? (
        <>
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <div className="flex gap-2">
            <Button
             className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
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
                    The following selected fields are present. Approving will update the invoice status.
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
                    onClick={handleConfirmApproval}
                    disabled={isApproving}
                  >
                    {isApproving ? "Confirming..." : "Confirm Approval"}
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