"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Progress } from "@workspace/ui/components/progress";
import { InvoiceDetails } from "@/lib/types/invoice";
import ConfirmationModals from "./confirmation-modals";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";
import { client } from "@/lib/axios-client";

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

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
          value={displayValue}
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
  invoice: {
    id: number;
    [key: string]: any;
  };
  initialInvoiceDetails?: InvoiceDetails | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onDetailsChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave?: (updatedDetails: InvoiceDetails) => Promise<boolean>;
}

export default function InvoiceDetailsForm({
  invoice,
  initialInvoiceDetails,
  isEditing,
  setIsEditing,
  onDetailsChange: externalOnDetailsChange,
  onSave: externalOnSave,
}: InvoiceDetailsFormProps) {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    initialInvoiceDetails || null
  );
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(!initialInvoiceDetails);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialInvoiceDetails && invoice?.id) {
      fetchInvoiceDetails();
    } else if (initialInvoiceDetails) {
      setSelectedFields(Object.keys(initialInvoiceDetails));
    }
  }, [invoice?.id, initialInvoiceDetails]);

  const fetchInvoiceDetails = async () => {
    if (!invoice?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await client.get<{ data: InvoiceDetails }>(
        `/api/v1/invoice/invoices/${invoice.id}`
      );
      setInvoiceDetails(response.data.data);
      setSelectedFields(Object.keys(response.data.data));
    } catch (err) {
      setError("Failed to load invoice details");
      toast.error("Failed to load invoice details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((key) => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!invoiceDetails) return;
    const { name, value } = e.target;
    setInvoiceDetails((prev) => (prev ? { ...prev, [name]: value } : null));

    if (externalOnDetailsChange) {
      externalOnDetailsChange(e);
    }
  };

  const handleSave = async () => {
    if (!invoiceDetails || !invoice?.id) return;

    try {
      let success = false;
      if (externalOnSave) {
        success = await externalOnSave(invoiceDetails);
      } else {
        const response = await client.patch<{ data: InvoiceDetails }>(
          `/api/v1/invoice/update-invoice`,
          invoiceDetails
        );
        setInvoiceDetails(response.data.data);
        toast.success("Invoice updated successfully");
        success = true;
      }

      if (success) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save invoice:", err);
      toast.error("Failed to save invoice");
    }
  };

  const allFields = Object.keys(invoiceDetails || {});
  const mandatoryFields = [
    "invoiceNumber",
    "vendorName",
    "customerName",
    "invoiceDate",
    "dueDate",
    "totalAmount",
    "currency",
    "lineItems",
    "costCode",
    "quantity",
    "rate",
    "description",
  ];

  const completedMandatoryFields = mandatoryFields.filter((field) =>
    selectedFields.includes(field)
  ).length;

  const progress =
    (completedMandatoryFields / (mandatoryFields.length || 1)) * 100;

  if (isLoading) {
    return (
      <Card className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div>Loading invoice details...</div>
      </Card>
    );
  }

  if (error || !invoiceDetails) {
    return (
      <Card className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-red-500">{error || "Failed to load invoice details"}</div>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Invoice Information</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="space-y-4">
            {allFields.map((key) => (
              <FormField
                key={key}
                fieldKey={key}
                label={formatLabel(key)}
                value={invoiceDetails[key as keyof InvoiceDetails] ?? null}
                isEditing={isEditing}
                isSelected={selectedFields.includes(key)}
                onToggle={handleFieldToggle}
                onChange={handleDetailsChange}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 mt-auto pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Field Completion</span>
              <span>
                {completedMandatoryFields} of {mandatoryFields.length} mandatory fields
                completed
              </span>
            </div>
            <Progress value={progress} />
          </div>
          <ConfirmationModals
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            invoiceDetails={invoiceDetails}
            selectedFields={selectedFields}
            onSave={handleSave}
          />
        </div>
      </CardContent>
    </Card>
  );
}