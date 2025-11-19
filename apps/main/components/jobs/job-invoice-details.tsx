"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { InvoiceDetails, LineItem } from "@/lib/types/invoice";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { formatLabel, formatDate } from "@/lib/utility/formatters";
import { client } from "@/lib/axios-client";
import { Loader2, Edit, Save, X } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { LineItemEditor } from "@/components/invoice-process/line-item-editor";
import { AddLineItemDialog } from "@/components/invoice-process/add-line-item-dialog";

interface JobInvoiceDetailsProps {
    invoiceDetails: InvoiceDetails;
    onApprove: () => void;
    onReject: () => void;
    onSave: () => void;
    onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFieldChange: () => void;
}

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
    const isDateField = fieldKey === "invoiceDate" || fieldKey === "dueDate";
    const isBooleanField = typeof value === "boolean";
    const isArrayField = Array.isArray(value);

    const [localValue, setLocalValue] = useState(value ?? "");

    useEffect(() => {
        setLocalValue(value ?? "");
    }, [value]);

    const displayValue = isArrayField
        ? `${value.length} item(s)`
        : isBooleanField
            ? value
                ? "Yes"
                : "No"
            : isDateField
                ? formatDate(value as string)
                : value ?? "N/A";

    const inputValue = isArrayField || isBooleanField ? String(displayValue) : String(localValue);
    const dateStringValue = isDateField && value ? formatDate(value as string) : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        onChange(e as any);
    };

    return (
        <div className="space-y-1.5">
            <Label htmlFor={fieldKey} className="text-xs font-medium">
                {label}
            </Label>

            {isDateField && isEditing ? (
                <DatePicker
                    value={dateStringValue}
                    onDateChange={(dateString) => onDateChange?.(fieldKey, dateString)}
                    placeholder={`Select ${label.toLowerCase()}`}
                />
            ) : (
                <Input
                    id={fieldKey}
                    name={fieldKey}
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!isEditing || isArrayField || isBooleanField}
                    className="h-9 text-sm"
                />
            )}
        </div>
    );
};

export default function JobInvoiceDetails({
    invoiceDetails,
    onApprove,
    onReject,
    onSave,
    onDetailsChange,
    onFieldChange,
}: JobInvoiceDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [isLoadingLineItems, setIsLoadingLineItems] = useState(false);

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
        "deletedAt",
        "lineItems",
    ];

    const allFields = Object.keys(invoiceDetails || {});
    const fieldsToDisplay = allFields.filter((key) => !hiddenFields.includes(key));

    // Fetch line items
    useEffect(() => {
        const fetchLineItems = async () => {
            if (!invoiceDetails?.id) return;

            setIsLoadingLineItems(true);
            try {
                const response = await client.get(`/api/v1/invoice/line-items/invoice/${invoiceDetails.id}`);
                const items = response.data?.data || response.data || [];
                setLineItems(items);
            } catch (error) {
                console.error("Failed to fetch line items:", error);
            } finally {
                setIsLoadingLineItems(false);
            }
        };

        fetchLineItems();
    }, [invoiceDetails?.id]);

    const handleDateChange = (fieldKey: string, dateString: string | undefined) => {
        if (!dateString) return;
        const syntheticEvent = {
            target: {
                name: fieldKey,
                value: dateString,
            },
        } as React.ChangeEvent<HTMLInputElement>;
        onDetailsChange(syntheticEvent);
        onFieldChange();
    };

    const handleSave = () => {
        onSave();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
                <div className="space-y-4 p-4">
                    {/* Invoice Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Invoice Information</CardTitle>
                                {!isEditing ? (
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={handleSave}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {fieldsToDisplay.map((fieldKey) => (
                                <FormField
                                    key={fieldKey}
                                    fieldKey={fieldKey}
                                    label={formatLabel(fieldKey)}
                                    value={invoiceDetails[fieldKey as keyof InvoiceDetails]}
                                    isEditing={isEditing}
                                    onChange={onDetailsChange}
                                    onDateChange={handleDateChange}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Line Items */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">
                                    Line Items ({lineItems.length})
                                </CardTitle>
                                <AddLineItemDialog invoiceId={invoiceDetails.id} onLineItemAdded={() => { }} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoadingLineItems ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : lineItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No line items found
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {lineItems.map((item) => (
                                        <LineItemEditor
                                            key={item.id}
                                            lineItem={item}
                                            onUpdate={() => { }}
                                            onDelete={() => { }}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>

            {/* Fixed Action Buttons */}
            <div className="flex gap-3 p-4 border-t bg-background">
                <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                    onClick={onReject}
                >
                    Reject
                </Button>
                <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white" onClick={onApprove}>
                    Approve
                </Button>
            </div>
        </div>
    );
}
