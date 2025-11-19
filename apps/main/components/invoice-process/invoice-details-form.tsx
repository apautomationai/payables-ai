"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";

import { InvoiceDetails, LineItem } from "@/lib/types/invoice";
import ConfirmationModals from "./confirmation-modals";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { formatLabel, formatDate } from "@/lib/utility/formatters";
import { client } from "@/lib/axios-client";
import { Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { LineItemEditor } from "./line-item-editor";
import { AddLineItemDialog } from "./add-line-item-dialog";

const FormField = ({
  fieldKey,
  label,
  value,
  isEditing,
  onChange,
  onDateChange,
}: {
  fieldKey: string;
  label: string;
  value: string | number | boolean | any[] | null | undefined;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (fieldKey: string, dateString: string | undefined) => void;
}) => {
  const isDateField = fieldKey === 'invoiceDate' || fieldKey === 'dueDate';
  const isBooleanField = typeof value === 'boolean';
  const isArrayField = Array.isArray(value);

  // Use local state for the input to avoid cursor jumping
  const [localValue, setLocalValue] = useState(value ?? "");

  // Update local value when prop changes (e.g., when switching invoices)
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  // For display-only fields (arrays, booleans), compute display value
  const displayValue = isArrayField
    ? `${value.length} item(s)`
    : isBooleanField
      ? (value ? "Yes" : "No")
      : isDateField
        ? formatDate(value as string)
        : value ?? "N/A";

  // For editable fields, use the local value
  const inputValue = isArrayField || isBooleanField
    ? String(displayValue)
    : String(localValue);

  // For date fields, use the formatted date string directly
  const dateStringValue = isDateField && value ? formatDate(value as string) : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Only call onChange on blur to update parent
    onChange(e as any);
  };

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={fieldKey}
        className="text-xs font-medium"
      >
        {label}
      </Label>

      {isDateField && isEditing ? (
        <DatePicker
          value={dateStringValue}
          onDateChange={(dateString) => onDateChange?.(fieldKey, dateString)}
          placeholder={`Select ${label.toLowerCase()}`}
          className="h-8"
        />
      ) : (
        <Input
          id={fieldKey}
          name={fieldKey}
          value={inputValue}
          readOnly={!isEditing || isArrayField || isBooleanField}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-8 read-only:bg-muted/50 read-only:border-dashed"
        />
      )}
    </div>
  );
};

interface InvoiceDetailsFormProps {
  invoiceDetails: InvoiceDetails;
  originalInvoiceDetails: InvoiceDetails;
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
  onFieldChange?: () => void;
  lineItemChangesRef?: React.MutableRefObject<{
    saveLineItemChanges: () => Promise<void>;
    hasChanges: () => boolean;
  } | null>;
}

export default function InvoiceDetailsForm({
  invoiceDetails,
  originalInvoiceDetails,
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
  onFieldChange,
  lineItemChangesRef,
}: InvoiceDetailsFormProps) {

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isLoadingLineItems, setIsLoadingLineItems] = useState(false);
  const [localInvoiceDetails, setLocalInvoiceDetails] = useState<InvoiceDetails>(invoiceDetails);
  const [isQuickBooksConnected, setIsQuickBooksConnected] = useState<boolean | null>(null);
  const [lineItemChanges, setLineItemChanges] = useState<Record<number, Partial<LineItem>>>({});

  const handleLineItemUpdate = (updatedLineItem: LineItem) => {
    setLineItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedLineItem.id ? updatedLineItem : item
      )
    );
  };

  const handleLineItemChange = (lineItemId: number, changes: Partial<LineItem>) => {
    setLineItemChanges((prev) => ({
      ...prev,
      [lineItemId]: {
        ...prev[lineItemId],
        ...changes,
      },
    }));

    // Notify parent that there are unsaved changes
    if (onFieldChange) {
      onFieldChange();
    }
  };

  const handleLineItemDelete = (lineItemId: number) => {
    // Remove from local state immediately for UI update
    setLineItems((prevItems) => prevItems.filter((item) => item.id !== lineItemId));

    // Remove any pending changes for this line item
    setLineItemChanges((prev) => {
      const newChanges = { ...prev };
      delete newChanges[lineItemId];
      return newChanges;
    });
  };

  const handleLineItemAdded = (newLineItem: LineItem) => {
    // Add to local state and sort alphabetically
    setLineItems((prevItems) => {
      const updatedItems = [...prevItems, newLineItem];
      return updatedItems.sort((a, b) => {
        const nameA = (a.item_name || '').toLowerCase();
        const nameB = (b.item_name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });
  };

  // Method to save all line item changes
  const saveLineItemChanges = async () => {
    const changeEntries = Object.entries(lineItemChanges);
    if (changeEntries.length === 0) {
      return; // No changes to save
    }

    try {
      // Save all line item changes in parallel
      await Promise.all(
        changeEntries.map(([lineItemId, changes]) =>
          client.patch(`/api/v1/invoice/line-items/${lineItemId}`, changes)
        )
      );

      // Clear the changes after successful save
      setLineItemChanges({});

      // Refresh line items to get updated data
      if (invoiceDetails?.id) {
        const response: any = await client.get(`/api/v1/invoice/line-items/invoice/${invoiceDetails.id}`);
        if (response.success) {
          // Sort line items by name (item_name)
          const sortedLineItems = [...response.data].sort((a, b) => {
            const nameA = (a.item_name || '').toLowerCase();
            const nameB = (b.item_name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
          setLineItems(sortedLineItems);
        }
      }
    } catch (error) {
      console.error("Error saving line item changes:", error);
      throw error; // Re-throw to let parent handle the error
    }
  };

  // Expose saveLineItemChanges to parent through ref
  useEffect(() => {
    if (lineItemChangesRef) {
      lineItemChangesRef.current = {
        saveLineItemChanges,
        hasChanges: () => Object.keys(lineItemChanges).length > 0,
      };
    }
  }, [lineItemChanges, lineItemChangesRef]);

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
          // Sort line items by name (item_name)
          const sortedLineItems = [...response.data].sort((a, b) => {
            const nameA = (a.item_name || '').toLowerCase();
            const nameB = (b.item_name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
          setLineItems(sortedLineItems);
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
    "s3JsonKey",
    "isDeleted",
    "deletedAt"
  ];
  const fieldsToDisplay = allFields.filter(key => !hiddenFields.includes(key));



  return (
    <div className="h-full flex flex-col gap-2">
      {/* Accordion Sections */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <Accordion type="multiple" defaultValue={["invoice-info", "line-items"]} className="space-y-2 h-full flex flex-col overflow-hidden">
          {/* Section 1: Invoice Information */}
          <AccordionItem value="invoice-info" className="border rounded-lg bg-card flex-shrink-0">
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <span className="text-sm font-semibold">Invoice Information</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <ScrollArea className="h-[220px] pr-2">
                <div className="space-y-2.5">
                  {fieldsToDisplay.map((key) => (
                    <FormField
                      key={key}
                      fieldKey={key}
                      label={formatLabel(key)}
                      value={localInvoiceDetails[key as keyof InvoiceDetails] ?? null}
                      isEditing={true}
                      onChange={onDetailsChange}
                      onDateChange={handleDateChange}
                    />
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Line Items */}
          <AccordionItem value="line-items" className="border rounded-lg bg-card flex-1 min-h-0 overflow-y-auto">
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="text-sm font-semibold">Line Items ({lineItems.length})</span>
                {isLoadingLineItems && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="flex flex-col max-h-[400px]">
                <ScrollArea className="flex-1 pr-2">
                  {lineItems.length > 0 ? (
                    <div className="space-y-2">
                      {lineItems.map((item) => (
                        <LineItemEditor
                          key={item.id}
                          lineItem={item}
                          onUpdate={handleLineItemUpdate}
                          onChange={handleLineItemChange}
                          onDelete={handleLineItemDelete}
                          isEditing={true}
                          isQuickBooksConnected={isQuickBooksConnected}
                        />
                      ))}
                    </div>
                  ) : (
                    !isLoadingLineItems && (
                      <p className="text-sm text-muted-foreground text-center py-3">
                        No line items found
                      </p>
                    )
                  )}
                </ScrollArea>

                {/* Add Line Item Button */}
                {invoiceDetails?.id && (
                  <div className="mt-2 flex-shrink-0">
                    <AddLineItemDialog
                      invoiceId={invoiceDetails.id}
                      onLineItemAdded={handleLineItemAdded}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Section 3: Action Buttons - Fixed at Bottom */}
      <div className="flex-shrink-0">
        <ConfirmationModals
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          invoiceDetails={invoiceDetails}
          originalInvoiceDetails={originalInvoiceDetails}
          selectedFields={selectedFields}
          onSave={onSave}
          onReject={onReject}
          onApprove={onApprove}
          onCancel={onCancel}
          onApprovalSuccess={onApprovalSuccess}
          onInvoiceDetailsUpdate={onInvoiceDetailsUpdate}
          onFieldChange={onFieldChange}
        />
      </div>
    </div>
  );
}

