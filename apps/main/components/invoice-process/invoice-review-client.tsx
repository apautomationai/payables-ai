"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    invoices[0]!.id
  );
  const selectedInvoice = useMemo(
    () => invoices.find((invoice) => invoice.id === selectedInvoiceId)!,
    [invoices, selectedInvoiceId]
  );

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    initialInvoiceDetails
  );
  const [selectedFields, setSelectedFields] = useState<string[]>(() =>
    initialInvoiceDetails ? Object.keys(initialInvoiceDetails) : []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (uploadedPdfUrl) {
        URL.revokeObjectURL(uploadedPdfUrl);
      }
    };
  }, [uploadedPdfUrl]);

  const handleSelectInvoice = (invoice: InvoiceListItem) => {
    setSelectedInvoiceId(invoice.id);
    const details = mockInvoiceDetails[invoice.id];
    setInvoiceDetails(details || null);
    setSelectedFields(details ? Object.keys(details) : []);
    setIsEditing(false);
    setUploadedPdfUrl(null);
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

  // This handler now correctly accepts a File object
  const handleFileUpload = (file: File) => {
    if (uploadedPdfUrl) {
      URL.revokeObjectURL(uploadedPdfUrl);
    }
    const url = URL.createObjectURL(file);
    setUploadedPdfUrl(url);
    console.log("File uploaded and ready for viewing:", file.name);
  };

  if (!isClient) {
    return null;
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-full col-span-full">
        <p className="text-muted-foreground">No invoices to display.</p>
      </div>
    );
  }

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
          onFileUpload={handleFileUpload}
        />
      </div>
      {invoiceDetails ? (
        <>
          <div className="md:col-span-5 lg:col-span-5">
            <PdfViewer
              invoice={invoiceDetails}
              pdfUrl={uploadedPdfUrl || invoiceDetails.pdfUrl}
            />
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
