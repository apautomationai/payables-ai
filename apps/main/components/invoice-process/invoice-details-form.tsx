import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Progress } from "@workspace/ui/components/progress";
import { InvoiceDetails, LineItem } from "@/lib/types/invoice";
import ConfirmationModals from "./confirmation-modals";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";

const formatLabel = (key: string) => {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
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
  value: string | number | LineItem[];
  isEditing: boolean;
  isSelected: boolean;
  onToggle: (fieldKey: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const displayValue = Array.isArray(value)
    ? `${value.length} item(s)`
    : String(value);

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

export default function InvoiceDetailsForm({
  invoiceDetails,
  isEditing,
  setIsEditing,
  onDetailsChange,
  selectedFields,
  setSelectedFields,
}: {
  invoiceDetails: InvoiceDetails;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFields: string[];
  setSelectedFields: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((key) => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const allFields = Object.keys(invoiceDetails);

  const mandatoryFields = [
    "invoiceNumber", "vendorName", "customerName",
    "invoiceDate", "dueDate", "totalAmount",
  ];
  const completedMandatoryFields = mandatoryFields.filter((field) =>
    selectedFields.includes(field)
  ).length;
  const progress = (completedMandatoryFields / mandatoryFields.length) * 100;

  return (
    <Card className="h-[800px] flex flex-col">
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
                value={invoiceDetails[key as keyof InvoiceDetails]}
                isEditing={isEditing}
                isSelected={selectedFields.includes(key)}
                onToggle={handleFieldToggle}
                onChange={onDetailsChange}
              />
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex-shrink-0 mt-auto pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Field Completion</span>
              <span>
                {completedMandatoryFields} of {mandatoryFields.length} mandatory fields completed
              </span>
            </div>
            <Progress value={progress} />
          </div>
          <ConfirmationModals
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            invoiceDetails={invoiceDetails}
            selectedFields={selectedFields}
          />
        </div>
      </CardContent>
    </Card>
  );
}

