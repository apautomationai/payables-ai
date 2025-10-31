"use client";

import React from "react";
import Link from "next/link";
import { InvoiceDetails } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ExternalLink } from "lucide-react";
import PdfPlaceholder from "./pdf-placeholder";

interface AttachmentViewerProps {
  selectedInvoice: InvoiceDetails | null;
}

export default function AttachmentViewer({ selectedInvoice }: AttachmentViewerProps) {
  const fileUrl = selectedInvoice?.sourcePdfUrl || selectedInvoice?.fileUrl;

  return (
    <Card className="h-[calc(100vh-10rem)] w-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
        <CardTitle className="truncate text-base">
          {selectedInvoice ? `Invoice #${selectedInvoice.invoiceNumber}` : "Invoice Preview"}
        </CardTitle>
        {fileUrl && (
          <Button variant="ghost" size="icon" asChild>
            <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col min-h-0">
        {fileUrl ? (
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