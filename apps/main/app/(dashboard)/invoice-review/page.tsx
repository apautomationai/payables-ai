import React from "react";
import client from "@/lib/fetch-client";
import { SubscriptionGuard } from "@/components/auth/subscription-guard";
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
    // console.error("Failed to fetch attachments:", error);
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
    // console.error("Failed to fetch invoices:", error);
    return { data: null, error: "Could not load the invoice list." };
  }
}

async function getInvoiceDetails(invoiceId: number): Promise<InvoiceDetails | null> {
  try {
    const response = await client.get<{ data: InvoiceDetails }>(`api/v1/invoice/invoices/${invoiceId}`, {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    // console.error(`Failed to fetch details for invoice ${invoiceId}:`, error);
    return null;
  }
}

// --- Invoice Review Content Component ---
async function InvoiceReviewContent({
  searchParams,
}: {
  searchParams: any;
}) {

  const { page } = await searchParams;

  const currentPage = Number(page);

  const attachmentsResult = await getAttachments(currentPage);
  const invoicesResult = await getInvoices(currentPage);

  // UPDATED: Provide default empty values if the API call fails, instead of showing an error.
  const { invoices, pagination: invoicesPagination } = invoicesResult.data || {
    invoices: [],
    pagination: { totalPages: 1 }
  };

  const { attachments, pagination: attachmentsPagination } = attachmentsResult.data || {
    attachments: [],
    pagination: { totalPages: 1 }
  };

  // The rest of the logic will now gracefully handle the empty 'invoices' array.
  const invoiceDetailPromises = invoices.map(invoice => getInvoiceDetails(invoice.id));
  const invoiceDetailsResults = await Promise.all(invoiceDetailPromises);

  const initialInvoiceCache: Record<number, InvoiceDetails> = {};
  invoiceDetailsResults.forEach((details) => {
    if (details) {
      initialInvoiceCache[details.id] = details;
    }
  });

  const initialSelectedInvoice = invoices.length > 0 ? invoices[0] : null;

  const initialInvoiceDetails = initialSelectedInvoice
    ? initialInvoiceCache[initialSelectedInvoice.id] || null
    : null;

  // The component will now always be rendered, even with empty/null data.
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

// --- Page Component ---
export default function InvoiceReviewPage({
  searchParams,
}: {
  searchParams: any;
}) {
  return (
    <SubscriptionGuard requiresAccess={true}>
      <InvoiceReviewContent searchParams={searchParams} />
    </SubscriptionGuard>
  );
}