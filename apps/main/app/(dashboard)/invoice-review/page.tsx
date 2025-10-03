import React from "react";
import client from "@/lib/fetch-client";
import InvoiceReviewClient from "@/components/invoice-process/invoice-review-client";
import type { Attachment } from "@/lib/types/invoice";
import { mockInvoices, mockInvoiceDetails } from "@/data/invoice-data";

export const dynamic = "force-dynamic";

interface AttachmentsApiResponse {
  attachments: Attachment[];
  pagination: {
    totalPages: number;
  };
}

async function getAttachments(page: number): Promise<AttachmentsApiResponse> {
  try {
    const response = await client.get<{ data: AttachmentsApiResponse }>(
      `api/v1/google/attachments?page=${page}&limit=20`,
      { cache: "no-store" }
    );
    return (
      response.data || {
        attachments: [],
        pagination: { totalPages: 1 },
      }
    );
  } catch (error) {
    console.error("Failed to fetch attachments:", error);
    return {
      attachments: [],
      pagination: { totalPages: 1 },
    };
  }
}

// Defines the shape of the props for the page component, fixing the type error.
interface InvoiceReviewPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function InvoiceReviewPage({
  searchParams,
}: InvoiceReviewPageProps) {
 
  const params = await searchParams;
  const page = params['page'];

  const pageParam = Array.isArray(page) ? page[0] : page;
  const currentPage = Number(pageParam || "1");

  const { attachments, pagination } = await getAttachments(currentPage);

  // Prepare initial data for both tabs from the mock data source.
  const firstMockId = Object.keys(mockInvoiceDetails)[0];
  const initialInvoiceDetails = firstMockId
    ? mockInvoiceDetails[firstMockId]
    : null;
    
  const initialSelectedInvoice = mockInvoices.length > 0 ? mockInvoices[0] : null;

  if (!initialInvoiceDetails || !initialSelectedInvoice) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">
          Error: Could not load initial mock invoice data.
        </p>
      </div>
    );
  }

  // Pass all required data to the client component.
  return (
    <InvoiceReviewClient
      attachments={attachments}
      initialInvoiceDetails={initialInvoiceDetails}
      currentPage={currentPage}
      totalPages={pagination.totalPages}
      invoices={mockInvoices}
      invoiceDetailsData={mockInvoiceDetails}
      initialSelectedInvoice={initialSelectedInvoice}
    />
  );
}