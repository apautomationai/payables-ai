import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Download, Printer, FileQuestion } from "lucide-react";
import { InvoiceDetails } from "@/lib/types/invoice";
import Link from "next/link";

// A dedicated component for the placeholder to keep the main component clean
const PdfPlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-4">
    <FileQuestion className="h-12 w-12 mb-4" />
    <h3 className="text-lg font-semibold">No PDF Available</h3>
    <p className="text-sm text-center">
      Please upload or select an invoice to view its document.
    </p>
  </div>
);

export default function PdfViewer({
  invoice,
  pdfUrl,
}: {
  invoice: InvoiceDetails;
  pdfUrl: string;
}) {
  // A URL is considered "viewable" if it's not a placeholder path and not null/empty.
  // Blob URLs from file uploads are the primary target here.
  const isViewable = pdfUrl && !pdfUrl.startsWith("/path/to/");

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
        <CardTitle className="truncate text-base">
          PDF Preview: {invoice.invoiceNumber}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={pdfUrl} download={`invoice-${invoice.invoiceNumber}.pdf`}>
              <Download className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      {/* This is the custom fix. By making CardContent a flex container that can grow 
        and applying `min-h-0`, we ensure it doesn't overflow its parent on mobile.
        This allows the iframe inside to correctly take up 100% of the height.
      */}
      <CardContent className="flex-grow p-0 flex flex-col min-h-0">
        {isViewable ? (
          <iframe
            src={pdfUrl}
            title={`PDF Preview for ${invoice.invoiceNumber}`}
            className="w-full h-full border-none"
          />
        ) : (
          <PdfPlaceholder />
        )}
      </CardContent>
    </Card>
  );
}
