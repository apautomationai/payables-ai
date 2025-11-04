"use client";

import React from "react";
import { FileQuestion } from "lucide-react";

export default function PdfPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-4">
      <FileQuestion className="h-12 w-12 mb-4" />
      <h3 className="text-lg font-semibold">No Document Selected</h3>
      <p className="text-sm text-center">
        Please select an invoice from the list to view its document.
      </p>
    </div>
  );
}

