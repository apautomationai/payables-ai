"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ExternalLink, FileQuestion } from "lucide-react";
import type { Attachment } from "@/lib/types/invoice";
import Link from "next/link";

const PdfPlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-4">
    <FileQuestion className="h-12 w-12 mb-4" />
    <h3 className="text-lg font-semibold">No PDF Available</h3>
    <p className="text-sm text-center">
      Please upload or select an invoice to view its document.
    </p>
  </div>
);

export default function AttachmentViewer({
  attachment,
  pdfUrl,
}: {
  attachment: Attachment | null; // MODIFIED: Allow attachment to be null
  pdfUrl: string | null;       // MODIFIED: Allow pdfUrl to be null
}) {
  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
        <CardTitle className="truncate text-base">
          {/* MODIFIED: Safely access attachment ID or show fallback text */}
          {attachment ? `Invoice ID: ${attachment.id}` : "New Invoice Preview"}
        </CardTitle>
        <div className="flex items-center gap-2">
          {pdfUrl && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col min-h-0">
        {pdfUrl ? (
          <div className="relative h-full w-full">
            <iframe
              src={pdfUrl}
              // MODIFIED: Safely access filename for the title
              title={attachment ? `PDF Preview for ${attachment.filename}` : "PDF Preview"}
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