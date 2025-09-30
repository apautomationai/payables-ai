import React from 'react';
import client from '@/lib/fetch-client';
import InvoiceReviewClient from '@/components/invoice-process/invoice-review-client';
import type { Attachment, InvoiceDetails } from '@/lib/types/invoice';
import { mockInvoiceDetails } from "@/data/invoice-data";

// This line tells Next.js to always render this page dynamically,
// which resolves conflicts between dynamic functions like searchParams and cookies.
export const dynamic = 'force-dynamic';

async function getAttachments(page: number) {
  try {
    const response = await client.get<{ data: Attachment[] }>(
      `api/v1/google/attachments?page=${page}&pageSize=20`, 
      { cache: 'no-store' }
    );
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch attachments:", error);
    return [];
  }
}

export default async function InvoiceReviewPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const pageParam = Array.isArray(searchParams?.page)
    ? searchParams.page[0]
    : searchParams?.page;
  const currentPage = Number(pageParam || '1');

  const attachments = await getAttachments(currentPage);

  const firstMockId = Object.keys(mockInvoiceDetails)[0];
  const initialInvoiceDetails = firstMockId ? mockInvoiceDetails[firstMockId] : null;

  if (!initialInvoiceDetails) {
     return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Error: Could not load initial mock invoice data.</p>
      </div>
    );
  }

  return (
    <InvoiceReviewClient 
      attachments={attachments} 
      initialInvoiceDetails={initialInvoiceDetails}
      currentPage={currentPage}
    />
  );
}