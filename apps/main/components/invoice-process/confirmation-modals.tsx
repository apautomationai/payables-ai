import React from "react";
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
import { InvoiceDetails, LineItem } from "@/lib/types/invoice";

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const renderValue = (value: string | number | LineItem[]) => {
  if (Array.isArray(value)) {
    return `${value.length} item(s)`;
  }
  return String(value);
};

export default function ConfirmationModals({
  isEditing,
  setIsEditing,
  invoiceDetails,
  selectedFields,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  invoiceDetails: InvoiceDetails;
  selectedFields: string[];
}) {
  const handleSave = () => {
    console.log("Saving changes...");
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log("Cancelling edit...");
    setIsEditing(false);
  };

  const handleReject = () => {
    console.log("Invoice rejected.");
    // Add logic for rejection here
  };

  return (
    <div className="flex gap-2 justify-end">
      {isEditing ? (
        <>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            Reject
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Approve</Button>
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
                <Button onClick={() => console.log("Confirmed!")}>
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
