"use client";

import React from "react";
import { InvoiceDetails } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ExternalLink, FileQuestion, Loader2 } from "lucide-react";
import Link from "next/link";

// A placeholder to display when no PDF is available
const PdfPlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-4">
    <FileQuestion className="h-12 w-12 mb-4" />
    <h3 className="text-lg font-semibold">No Document Selected</h3>
    <p className="text-sm text-center">
      Please select an invoice from the list to view its document.
    </p>
  </div>
);

interface AttachmentViewerProps {
  selectedInvoice: InvoiceDetails | null;
  isLoading: boolean;
}

export default function AttachmentViewer({
  selectedInvoice,
  isLoading,
}: AttachmentViewerProps) {
  // Use sourcePdfUrl (from attachment) if available, otherwise fall back to fileUrl (from invoice)
  const fileUrl = selectedInvoice?.sourcePdfUrl || selectedInvoice?.fileUrl;

  return (
    <Card className="h-[calc(100vh-10rem)] w-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
        <CardTitle className="truncate text-base">
          {selectedInvoice ? `Invoice #${selectedInvoice.invoiceNumber}` : "Invoice Preview"}
        </CardTitle>
        <div className="flex items-center gap-2">
          {fileUrl && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : fileUrl ? (
          <div className="relative h-full w-full">
            <iframe
              src={fileUrl}
              title={selectedInvoice ? `PDF Preview for Invoice #${selectedInvoice.invoiceNumber}` : "PDF Preview"}
              className="w-full h-full border-none"
            />
          </div>
        ) : (
          <PdfPlaceholder />
        )}
      </CardContent>
    </Card>
  );
}

