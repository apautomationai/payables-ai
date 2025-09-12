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
import { MultiSelect } from "@/components/invoice-process/multi-selector";

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
  // Handle rendering for the lineItems array
  const displayValue = Array.isArray(value)
    ? `${value.length} item(s)`
    : String(value);

  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={displayValue}
        readOnly={!isEditing || Array.isArray(value)} // Don't allow editing line items directly in this simple view
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Invoice Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="space-y-3">
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
      </CardContent>
    </Card>
  );
}
