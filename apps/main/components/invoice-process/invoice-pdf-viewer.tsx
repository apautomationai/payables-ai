"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, ExternalLink } from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface InvoicePdfViewerProps {
  fileUrl: string;
  sourcePdfUrl?: string | null;
}

export default function InvoicePdfViewer({
  fileUrl,
}: InvoicePdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="flex flex-col h-full w-full rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Controls */}
      <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/30">
        <div className="flex items-center gap-2">

        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            disabled={scale >= 2.0}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(fileUrl, '_blank')}
            className="h-8 w-8"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <ScrollArea className="flex-1 bg-muted/20">
        <div className="flex justify-center p-4">
          {fileUrl ? (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }
              error={
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  <p>Failed to load PDF. Please try again.</p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                }
                className="shadow-lg"
              />
            </Document>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground py-20">
              <p>No PDF available.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}