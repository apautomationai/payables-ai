import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import { InvoiceListItem } from "@/lib/types/invoice";
import { cn } from "@workspace/ui/lib/utils";
import PdfUploader from "./pdf-uploader";

const statusColors = {
  Completed: "text-green-500",
  Pending: "text-yellow-500",
  "Requires Attention": "text-red-500",
};

export default function InvoiceList({
  invoices,
  selectedInvoice,
  onSelectInvoice,
  onFileUpload,
}: {
  invoices: InvoiceListItem[];
  selectedInvoice: InvoiceListItem;
  onSelectInvoice: (invoice: InvoiceListItem) => void;
  onFileUpload: (file: File) => void;
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Upload & Review</CardTitle>
        <div className="mt-4">
          <PdfUploader onFileUpload={onFileUpload} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-8" />
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          <h3 className="text-sm font-semibold mb-2">Invoices</h3>
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
        </div>
      </CardContent>
    </Card>
  );
}
