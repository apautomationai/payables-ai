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

// UPDATED: This function now accepts the numeric 'id'
async function getInvoiceDetails(invoiceId: number): Promise<InvoiceDetails | null> {
  try {
    const response = await client.get<{data: InvoiceDetails}>(`api/v1/invoice/invoices/${invoiceId}`, {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    // console.error(`Failed to fetch details for invoice ${invoiceId}:`, error);
    return null;
  }
}

// --- Page Component ---
interface InvoiceReviewPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function InvoiceReviewPage({
  searchParams,
}: InvoiceReviewPageProps) {
 const params = await searchParams;
  const pageParam = params['page'] ? (Array.isArray(searchParams['page']) ? searchParams['page'][0] : searchParams['page']) : "1";
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

  const initialSelectedInvoice = invoices.length > 0 ? invoices[0] : null;
  
  // UPDATED: Pass the numeric 'id' to fetch the initial details, matching the new backend logic.
  const initialInvoiceDetails = initialSelectedInvoice
    ? await getInvoiceDetails(initialSelectedInvoice.id)
    : null;

  // if (!initialSelectedInvoice) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <p>No invoices found.</p>
  //     </div>
  //   );
  // }

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
    />
  );
}