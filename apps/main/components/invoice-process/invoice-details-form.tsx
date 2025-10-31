"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Progress } from "@workspace/ui/components/progress";
import { InvoiceDetails, LineItem } from "@/lib/types/invoice";
import ConfirmationModals from "./confirmation-modals";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";
import { formatLabel, formatDate } from "@/lib/utility/formatters";
import { client } from "@/lib/axios-client";
import { Loader2 } from "lucide-react";

const FormField = ({
  fieldKey,
  label,
  value,
  isEditing,
  isSelected,
  onToggle,
  onChange,
}: {
  fieldKey: string;
  label: string;
  value: string | number | any[] | null | undefined;
  isEditing: boolean;
  isSelected: boolean;
  onToggle: (fieldKey: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const displayValue = Array.isArray(value)
    ? `${value.length} item(s)`
    : (fieldKey === 'invoiceDate' || fieldKey === 'dueDate')
      ? formatDate(value as string)
      : value ?? "N/A";

  return (
    <div className="flex items-start gap-4">
      <Checkbox
        id={`select-${fieldKey}`}
        checked={isSelected}
        onCheckedChange={() => onToggle(fieldKey)}
        className="mt-2.5"
      />
      <div className="flex-1 space-y-1">
        <Label
          htmlFor={fieldKey}
          className={cn(
            "text-xs",
            isSelected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </Label>
        <Input
          id={fieldKey}
          name={fieldKey}
          value={String(displayValue)}
          readOnly={!isEditing || Array.isArray(value)}
          onChange={onChange}
          className={cn(
            "h-9 read-only:bg-muted/50 read-only:border-dashed",
            isSelected
              ? "border-green-500 focus-visible:ring-green-500/20"
              : "border-input"
          )}
        />
      </div>
    </div>
  );
};

interface InvoiceDetailsFormProps {
  invoiceDetails: InvoiceDetails;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFields: string[];
  setSelectedFields: React.Dispatch<React.SetStateAction<string[]>>;
  onSave: () => Promise<void>;
  onReject: () => Promise<void>;
  onApprove: () => Promise<void>;
  onCancel: () => void;
  onApprovalSuccess?: () => void;
  onInvoiceDetailsUpdate?: (updatedDetails: InvoiceDetails) => void;
}

export default function InvoiceDetailsForm({
  invoiceDetails,
  isEditing,
  setIsEditing,
  onDetailsChange,
  selectedFields,
  setSelectedFields,
  onSave,
  onReject,
  onApprove,
  onCancel,
  onApprovalSuccess,
  onInvoiceDetailsUpdate,
}: InvoiceDetailsFormProps) {

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isLoadingLineItems, setIsLoadingLineItems] = useState(false);

  // Fetch line items when invoice details change
  useEffect(() => {
    const fetchLineItems = async () => {
      if (!invoiceDetails?.id) return;

      setIsLoadingLineItems(true);
      try {
        const response: any = await client.get(`/api/v1/invoice/line-items/invoice/${invoiceDetails.id}`);
        if (response.success) {
          setLineItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching line items:", error);
        setLineItems([]);
      } finally {
        setIsLoadingLineItems(false);
      }
    };

    fetchLineItems();
  }, [invoiceDetails?.id]);

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((key) => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const allFields = Object.keys(invoiceDetails || {});
  const hiddenFields = [
    "id",
    "userId",
    "attachmentId",
    "createdAt",
    "updatedAt",
    "status",
    "fileUrl",
    "fileKey",
    "sourcePdfUrl",
    "s3JsonKey"
  ];
  const fieldsToDisplay = allFields.filter(key => !hiddenFields.includes(key));

  const mandatoryFields = [
    "invoiceNumber",
    "vendorName",
    "customerName",
    "invoiceDate",
    "dueDate",
    "totalAmount",
  ];

  const completedMandatoryFields = mandatoryFields.filter((field) =>
    selectedFields.includes(field) && invoiceDetails[field as keyof InvoiceDetails]
  ).length;

  const progress =
    (completedMandatoryFields / (mandatoryFields.length || 1)) * 100;

  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Invoice Information</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="space-y-4">
            {fieldsToDisplay.map((key) => (
              <FormField
                key={key}
                fieldKey={key}
                label={formatLabel(key)}
                value={invoiceDetails[key as keyof InvoiceDetails] ?? null}
                isEditing={isEditing}
                isSelected={selectedFields.includes(key)}
                onToggle={handleFieldToggle}
                onChange={onDetailsChange}
              />
            ))}

            {/* Line Items Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">Line Items</h3>
                {isLoadingLineItems && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {lineItems.length > 0 ? (
                <div className="space-y-2">
                  {lineItems.map((item, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-3 text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-foreground">
                          {item.item_name || `Item ${index + 1}`}
                        </span>
                        <span className="text-muted-foreground">
                          ${parseFloat(item.amount || "0").toFixed(2)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground text-xs mb-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Qty: {item.quantity || 1}</span>
                        <span>Rate: ${parseFloat(item.rate || "0").toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !isLoadingLineItems && (
                  <p className="text-sm text-muted-foreground">No line items found</p>
                )
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 mt-auto pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Field Completion</span>
              <span>
                {completedMandatoryFields} of {mandatoryFields.length}
              </span>
            </div>
            <Progress value={progress} />
          </div>
          <ConfirmationModals
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            invoiceDetails={invoiceDetails}
            selectedFields={selectedFields}
            onSave={onSave}
            onReject={onReject}
            onApprove={onApprove}
            onCancel={onCancel}
            onApprovalSuccess={onApprovalSuccess}
            onInvoiceDetailsUpdate={onInvoiceDetailsUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
}

