import React from "react";
import client from "@/lib/fetch-client";
import InvoiceReviewClient from "@/components/invoice-process/invoice-review-client";
import type { Attachment, InvoiceDetails, InvoiceListItem } from "@/lib/types/invoice";

export const dynamic = "force-dynamic";

// --- Interfaces for API responses ---
interface AttachmentsApiResponse {
  attachments: Attachment[];
  pagination: { totalPages: number };
}

interface InvoicesApiResponse {
  invoices: InvoiceListItem[];
  pagination: { totalPages: number };
}

// --- Data Fetching Functions ---
async function getAttachments(page: number) {
  try {
    const response = await client.get<{ data: AttachmentsApiResponse }>(
      `api/v1/google/attachments?page=${page}&limit=20`,
      { cache: "no-store" }
    );
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Failed to fetch attachments:", error);
    return { data: null, error: "Could not load attachments." };
  }
}

async function getInvoices(page: number) {
  try {
    const response = await client.get<{ data: InvoicesApiResponse }>(
      `api/v1/invoice/invoices?page=${page}&limit=20`,
      { cache: "no-store" }
    );
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return { data: null, error: "Could not load the invoice list." };
  }
}

async function getInvoiceDetails(invoiceId: number): Promise<InvoiceDetails | null> {
  try {
    const response = await client.get<{data: InvoiceDetails}>(`api/v1/invoice/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch details for invoice ${invoiceId}:`, error);
    return null;
  }
}

// --- Page Component ---
export default async function InvoiceReviewPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const pageParam = searchParams['page'] ? (Array.isArray(searchParams['page']) ? searchParams['page'][0] : searchParams['page']) : "1";
  const currentPage = Number(pageParam);

  const attachmentsResult = await getAttachments(currentPage);
  const invoicesResult = await getInvoices(currentPage);

  if (invoicesResult.error || !invoicesResult.data) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <h2 className="text-xl font-semibold text-red-600">Failed to Load Data</h2>
          <p className="text-muted-foreground">{invoicesResult.error}</p>
        </div>
      </div>
    );
  }

  const { invoices, pagination: invoicesPagination } = invoicesResult.data;
  const { attachments, pagination: attachmentsPagination } = attachmentsResult.data || { attachments: [], pagination: { totalPages: 1 }};

  // Pre-fetch all invoice details in parallel
  const invoiceDetailPromises = invoices.map(invoice => getInvoiceDetails(invoice.id));
  const invoiceDetailsResults = await Promise.all(invoiceDetailPromises);

  // Create a cache map (id -> details) from the results
  const initialInvoiceCache: Record<number, InvoiceDetails> = {};
  invoiceDetailsResults.forEach((details) => {
    if (details) {
      initialInvoiceCache[details.id] = details;
    }
  });
  
  const initialSelectedInvoice = invoices.length > 0 ? invoices[0] : null;
  
  // Get the initial details from the newly created cache
  const initialInvoiceDetails = initialSelectedInvoice
    ? initialInvoiceCache[initialSelectedInvoice.id] || null
    : null;


  return (
    <InvoiceReviewClient
      attachments={attachments}
      currentPage={currentPage}
      totalPages={attachmentsPagination.totalPages}
      invoices={invoices}
      invoiceCurrentPage={currentPage}
      invoiceTotalPages={invoicesPagination.totalPages}
      initialSelectedInvoice={initialSelectedInvoice}
      initialInvoiceDetails={initialInvoiceDetails}
      initialInvoiceCache={initialInvoiceCache}
    />
  );
}