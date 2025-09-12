"use client";

import React, { useState, useMemo } from "react";
import InvoiceList from "./invoice-list";
import PdfViewer from "./pdf-viewer";
import InvoiceDetailsForm from "./invoice-details-form";
import { InvoiceListItem, InvoiceDetails } from "@/lib/types/invoice";
import { mockInvoiceDetails } from "@/data/invoice-data";

export default function InvoiceReviewClient({
  invoices,
  initialInvoiceDetails,
}: {
  invoices: InvoiceListItem[];
  initialInvoiceDetails: InvoiceDetails;
}) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-full col-span-full">
        <p className="text-muted-foreground">No invoices to display.</p>
      </div>
    );
  }

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    invoices[0].id
  );

  const selectedInvoice = useMemo(
    () => invoices.find((invoice) => invoice.id === selectedInvoiceId)!,
    [invoices, selectedInvoiceId]
  );

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    initialInvoiceDetails
  );

  // State to manage which fields are selected for processing
  const [selectedFields, setSelectedFields] = useState<string[]>(() =>
    invoiceDetails ? Object.keys(invoiceDetails) : []
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleSelectInvoice = (invoice: InvoiceListItem) => {
    setSelectedInvoiceId(invoice.id);
    const details = mockInvoiceDetails[invoice.id];
    setInvoiceDetails(details || null);
    // When a new invoice is selected, reset selected fields to all fields
    setSelectedFields(details ? Object.keys(details) : []);
    setIsEditing(false);
  };

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!invoiceDetails) return;
    const { name, value } = e.target;
    setInvoiceDetails((prevDetails) =>
      prevDetails ? { ...prevDetails, [name]: value } : null
    );
  };

  if (!selectedInvoice) {
    return (
      <div className="flex items-center justify-center h-full col-span-full">
        <p className="text-red-500">
          Error: Could not find the selected invoice.
        </p>
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-3 lg:col-span-3">
        <InvoiceList
          invoices={invoices}
          selectedInvoice={selectedInvoice}
          onSelectInvoice={handleSelectInvoice}
        />
      </div>

      {invoiceDetails ? (
        <>
          <div className="md:col-span-5 lg:col-span-5">
            <PdfViewer invoice={invoiceDetails} />
          </div>
          <div className="md:col-span-4 lg:col-span-4">
            <InvoiceDetailsForm
              invoiceDetails={invoiceDetails}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onDetailsChange={handleDetailsChange}
              selectedFields={selectedFields}
              setSelectedFields={setSelectedFields}
            />
          </div>
        </>
      ) : (
        <div className="md:col-span-9 flex items-center justify-center text-muted-foreground">
          <p>Could not load details for the selected invoice.</p>
        </div>
      )}
    </div>
  );
}
