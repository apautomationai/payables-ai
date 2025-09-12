import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Search, Upload } from "lucide-react";
import { InvoiceListItem } from "@/lib/types/invoice";
import { cn } from "@workspace/ui/lib/utils";

const statusColors = {
  Completed: "text-green-500",
  Pending: "text-yellow-500",
  "Requires Attention": "text-red-500",
};

export default function InvoiceList({
  invoices,
  selectedInvoice,
  onSelectInvoice,
}: {
  invoices: InvoiceListItem[];
  selectedInvoice: InvoiceListItem;
  onSelectInvoice: (invoice: InvoiceListItem) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Invoice Review</CardTitle>
        <Button variant="outline" className="w-full mt-4">
          <Upload className="mr-2 h-4 w-4" />
          Upload Invoice
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8" />
        </div>
        <div className="flex flex-col space-y-2">
          {invoices.map((invoice) => (
            <button
              key={invoice.id}
              onClick={() => onSelectInvoice(invoice)}
              className={cn(
                "rounded-md p-3 text-left transition-colors hover:bg-muted",
                selectedInvoice.id === invoice.id && "bg-muted"
              )}
            >
              <p className="font-semibold">{invoice.number}</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span
                  className={cn(
                    "font-medium",
                    statusColors[invoice.status] || "text-muted-foreground"
                  )}
                >
                  {invoice.status}
                </span>
                <span>{invoice.date}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
