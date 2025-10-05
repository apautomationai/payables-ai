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
  onSave?: () => Promise<boolean | void>;
}

export default function ConfirmationModals({
  isEditing,
  setIsEditing,
  invoiceDetails,
  selectedFields,
  onSave,
}: ConfirmationModalsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSave();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = () => {
    // console.log("Invoice rejected.");
   
    toast.error("Invoice rejected.");
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Approve</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Invoice Approval</DialogTitle>
                <DialogDescription>
                  Please review the selected invoice details before confirming.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-60 overflow-y-auto my-4 pr-2">
                <div className="grid gap-2 text-sm">
                  {selectedFields.map((key) => (
                    <div key={key} className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-muted-foreground">
                        {formatLabel(key)}
                      </span>
                      <span className="font-semibold text-right truncate">
                        {renderValue(invoiceDetails[key as keyof InvoiceDetails])}
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
                  onClick={() => {
                    console.log("Invoice approved");
                    // Add approval logic here
                  }}
                >
                  Confirm Approval
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}