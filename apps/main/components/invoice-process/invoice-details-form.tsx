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
import { DatePicker } from "@/components/ui/date-picker";
import { LineItemEditor } from "./line-item-editor";

const FormField = ({
  fieldKey,
  label,
  value,
  isEditing,
  isSelected,
  onToggle,
  onChange,
  onDateChange,
}: {
  fieldKey: string;
  label: string;
  value: string | number | boolean | any[] | null | undefined;
  isEditing: boolean;
  isSelected: boolean;
  onToggle: (fieldKey: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (fieldKey: string, dateString: string | undefined) => void;
}) => {
  const isDateField = fieldKey === 'invoiceDate' || fieldKey === 'dueDate';

  const displayValue = Array.isArray(value)
    ? `${value.length} item(s)`
    : typeof value === 'boolean'
      ? (value ? "Yes" : "No")
      : isDateField
        ? formatDate(value as string)
        : value ?? "N/A";

  // For date fields, use the formatted date string directly
  const dateStringValue = isDateField && value ? formatDate(value as string) : undefined;

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

        {isDateField && isEditing ? (
          <DatePicker
            value={dateStringValue}
            onDateChange={(dateString) => onDateChange?.(fieldKey, dateString)}
            placeholder={`Select ${label.toLowerCase()}`}
            className={cn(
              "h-9",
              isSelected
                ? "border-green-500 focus-visible:ring-green-500/20"
                : "border-input"
            )}
          />
        ) : (
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
        )}
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
  const [localInvoiceDetails, setLocalInvoiceDetails] = useState<InvoiceDetails>(invoiceDetails);
  const [isQuickBooksConnected, setIsQuickBooksConnected] = useState<boolean | null>(null);

  const handleLineItemUpdate = (updatedLineItem: LineItem) => {
    setLineItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedLineItem.id ? updatedLineItem : item
      )
    );
  };

  // QuickBooks integration check function (same as in confirmation modals)
  const checkQuickBooksIntegration = async (): Promise<boolean> => {
    try {
      const response: any = await client.get('/api/v1/quickbooks/status');
      return response?.data?.connected === true;
    } catch (error) {
      console.error('Error checking QuickBooks integration:', error);
      return false;
    }
  };

  // Update local state when invoiceDetails prop changes
  useEffect(() => {
    setLocalInvoiceDetails(invoiceDetails);
  }, [invoiceDetails]);

  // Check QuickBooks connection status once for all line items
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkQuickBooksIntegration();
        setIsQuickBooksConnected(isConnected);
      } catch (error) {
        console.error("Error checking QuickBooks connection:", error);
        setIsQuickBooksConnected(false);
      }
    };

    checkConnection();

    // Refresh connection status when user returns to the page (e.g., from integrations page)
    const handleFocus = () => {
      checkConnection();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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

  const handleDateChange = (fieldKey: string, dateString: string | undefined) => {
    // Convert YYYY-MM-DD to ISO string for storage (but keep it as date-only)
    const isoString = dateString ? `${dateString}T00:00:00.000Z` : null;

    setLocalInvoiceDetails(prev => ({
      ...prev,
      [fieldKey]: isoString
    }));

    // Create a synthetic event to maintain compatibility with existing onChange handler
    const syntheticEvent = {
      target: {
        name: fieldKey,
        value: isoString || ''
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onDetailsChange(syntheticEvent);
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
    selectedFields.includes(field) && localInvoiceDetails[field as keyof InvoiceDetails]
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
                value={localInvoiceDetails[key as keyof InvoiceDetails] ?? null}
                isEditing={isEditing}
                isSelected={selectedFields.includes(key)}
                onToggle={handleFieldToggle}
                onChange={onDetailsChange}
                onDateChange={handleDateChange}
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
                <div className="space-y-3">
                  {lineItems.map((item) => (
                    <LineItemEditor
                      key={item.id}
                      lineItem={item}
                      onUpdate={handleLineItemUpdate}
                      isEditing={isEditing}
                      isQuickBooksConnected={isQuickBooksConnected}
                    />
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

