import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Progress } from "@workspace/ui/components/progress";
import { InvoiceDetails, LineItem } from "@/lib/types/invoice";
import ConfirmationModals from "./confirmation-modals";
import { MultiSelect } from "./multi-selector";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const FormField = ({
  label,
  value,
  isEditing,
  onChange,
}: {
  label: string;
  value: string | number | LineItem[];
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const displayValue = Array.isArray(value)
    ? `${value.length} item(s)`
    : String(value);

  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={displayValue}
        readOnly={!isEditing || Array.isArray(value)}
        onChange={onChange}
        className="h-9 read-only:bg-muted/50 read-only:border-dashed"
      />
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
  const allFields = Object.keys(invoiceDetails).map((key) => ({
    value: key,
    label: formatLabel(key),
  }));

  const mandatoryFields = [
    "invoiceNumber",
    "vendorName",
    "customerName",
    "invoiceDate",
    "dueDate",
    "totalAmount",
  ];
  const completedMandatoryFields = mandatoryFields.filter((field) =>
    selectedFields.includes(field)
  ).length;
  const progress = (completedMandatoryFields / mandatoryFields.length) * 100;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Invoice Information</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div>
          <Label className="text-xs text-muted-foreground">
            Fields to include
          </Label>
          <MultiSelect
            options={allFields}
            selected={selectedFields}
            onChange={setSelectedFields}
          />
        </div>

        {/* This is the key change: The ScrollArea now wraps the form fields 
            and is set to grow and fill the available space. */}
        <ScrollArea className="flex-grow pr-4 -mr-4 ">
          <div className="space-y-4 pb-4 max-h-96">
            {selectedFields.map((key) => (
              <FormField
                key={key}
                label={formatLabel(key)}
                value={invoiceDetails[key as keyof InvoiceDetails]}
                isEditing={isEditing}
                onChange={onDetailsChange}
              />
            ))}
          </div>
        </ScrollArea>

        {/* The footer content is now outside the scrollable area */}
        <div className="flex-shrink-0 mt-auto pt-4 border-t space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Field Completion</span>
              <span>
                {completedMandatoryFields} of {mandatoryFields.length} mandatory
                fields completed
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
