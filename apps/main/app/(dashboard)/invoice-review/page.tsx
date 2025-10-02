// @/app/invoice-review/page.tsx

import React from "react";
import client from "@/lib/fetch-client";
import InvoiceReviewClient from "@/components/invoice-process/invoice-review-client";
import type { Attachment, InvoiceDetails } from "@/lib/types/invoice";
import { mockInvoiceDetails } from "@/data/invoice-data";

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
    // console.error("Failed to fetch attachments:", error);
    return {
      attachments: [],
      pagination: { totalPages: 1 },
    };
  }
}

// FIX 1: Update the interface to define searchParams as a Promise
interface InvoiceReviewPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvoiceReviewPage({
  searchParams,
}: InvoiceReviewPageProps) {
  // FIX 2: Await the searchParams Promise to get the resolved object
  const params = await searchParams;
  const page = params['page'];

  const pageParam = Array.isArray(page) ? page[0] : page;
  const currentPage = Number(pageParam || "1");

  const { attachments, pagination } = await getAttachments(currentPage);

  const firstMockId = Object.keys(mockInvoiceDetails)[0];
  const initialInvoiceDetails = firstMockId
    ? mockInvoiceDetails[firstMockId]
    : null;

  if (!initialInvoiceDetails) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">
          Error: Could not load initial mock invoice data.
        </p>
      </div>
    );
  }

  return (
    <InvoiceReviewClient
      attachments={attachments}
      initialInvoiceDetails={initialInvoiceDetails}
      currentPage={currentPage}
      totalPages={pagination.totalPages}
    />
  );
}

