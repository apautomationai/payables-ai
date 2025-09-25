import React from "react";

import InvoiceReviewClient from "@/components/invoice-process/invoice-review-client";
import { mockInvoices, mockInvoiceDetails } from "@/data//invoice-data";

// This is the main server component for the page.
// It fetches initial data and passes it to the client component.
export default function InvoiceReviewPage() {

  // In a real app, you would fetch this data from your API
  const invoices = mockInvoices;
 


  // Handle the case where there might be no invoices
  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No invoices found.</p>
      </div>
    );
  }

  const initialInvoiceDetails = mockInvoiceDetails[invoices[0]!.id];

  // Handle the case where the initial invoice details might not exist
  if (!initialInvoiceDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: Initial invoice data is missing.</p>
      </div>
    );
  }

  return (
    <InvoiceReviewClient
      invoices={invoices}
      initialInvoiceDetails={initialInvoiceDetails}
    />
  );
}
