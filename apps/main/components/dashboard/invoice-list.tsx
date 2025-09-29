"use client";

import React, { useState } from "react";
import { Attachment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface InvoiceListProps {
  attachments: Attachment[];
  selectedAttachment: Attachment | null;
  onSelectAttachment: (attachment: Attachment) => void;
}

const StatusSelector = () => {
  const [status, setStatus] = useState("Pending");

  const statusColors: { [key: string]: string } = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    Approved: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
    Paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  };
  
  return (
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className={cn("h-8 w-full border-none text-xs font-semibold focus:ring-0", statusColors[status])}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Approved">Approved</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
        <SelectItem value="Paid">Paid</SelectItem>
      </SelectContent>
    </Select>
  );
};


export default function InvoiceList({
  attachments,
  selectedAttachment,
  onSelectAttachment,
}: InvoiceListProps) {
  return (
    // THE KEY FIX: The Card now calculates its own height based on the viewport,
    // making it independent of parent layout issues.
    <Card className="flex flex-col h-[calc(100vh-275px)]">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Invoices</CardTitle>
          <span className="text-sm bg-muted text-muted-foreground rounded-full px-2 py-0.5">
            {attachments.length} total
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="divide-y">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                onClick={() => onSelectAttachment(attachment)}
                className={cn(
                  "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedAttachment?.id === attachment.id && "bg-muted"
                )}
              >
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    INVOICE NUMBER
                  </p>
                  <p className="font-semibold text-primary truncate">
                    {attachment.id.length > 16
                      ? `${attachment.id.substring(0, 8)}...${attachment.id.substring(attachment.id.length - 8)}`
                      : attachment.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">VENDOR</p>
                    <p>Unknown Vendor</p>
                  </div>
                   <div>
                    <p className="text-xs text-muted-foreground">CUSTOMER</p>
                    <p>No Customer</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">RATE</p>
                    <p>$0.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">TOTAL</p>
                    <p className="font-bold">$3,480.97</p>
                  </div>
                   <div className="col-span-1">
                    <p className="text-xs text-muted-foreground">STATUS</p>
                    <div className="w-32">
                      <StatusSelector />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}