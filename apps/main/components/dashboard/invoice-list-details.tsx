"use client";

import React from "react";
import { Attachment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { CreditCard } from "lucide-react";

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="font-semibold text-primary mt-1 truncate">{value}</p>
  </div>
);

const truncateId = (id: string) => {
  if (id.length > 20) {
    return `${id.substring(0, 8)}...${id.substring(id.length - 8)}`;
  }
  return id;
};

interface InvoiceDetailsProps {
  attachment: Attachment | null;
}

export default function InvoiceDetails({ attachment }: InvoiceDetailsProps) {
  if (!attachment) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold">No Invoice Selected</p>
          <p className="text-muted-foreground mt-1">Please select an invoice from the list to see its details.</p>
        </div>
      </Card>
    );
  }

  const shortId = truncateId(attachment.id);

  return (
    <Card className="h-full relative">
      <div className="absolute top-6 -left-5">
        <Button variant="outline" size="icon" className="bg-background shadow-md h-10 w-10">
          <CreditCard className="h-5 w-5" />
        </Button>
      </div>

      <CardHeader>
        <CardTitle className="truncate">{shortId}</CardTitle>
        <CardDescription>Invoice from Unknown Vendor</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-y-6 gap-x-8">
          <DetailItem label="Invoice Number" value={shortId} />
          <DetailItem label="Vendor" value="Unknown Vendor" />
          <DetailItem label="Customer" value="No Customer" />
          <DetailItem label="Cost Code" value="No Cost Code" />
          <DetailItem label="Rate" value="$0.00" />
          <DetailItem label="Quantity" value="0" />
          <DetailItem label="Total" value="$3,480.97" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
            <div className="mt-1">
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-none font-semibold"
              >
                Pending
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}