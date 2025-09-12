import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
} from "lucide-react";
import { InvoiceDetails } from "@/lib/types/invoice";

export default function PdfViewer({ invoice }: { invoice: InvoiceDetails }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="truncate text-base">
          {invoice.invoiceNumber}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-muted-foreground">
          {/* In a real app, a PDF viewer component would go here */}
          <p>PDF Preview for {invoice.invoiceNumber}</p>
          <p className="text-xs text-center">
            (Placeholder for {invoice.pdfUrl})
          </p>
        </div>
      </CardContent>
      <div className="flex items-center justify-center gap-2 p-2 border-t">
        <Button variant="ghost" size="icon">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span>100%</span>
        <Button variant="ghost" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>1 / 1</span>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
