"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { InvoiceListItem, InvoiceDetails, DashboardMetrics } from "@/lib/types";
import EmptyState from "./empty-state";
import DashboardDataView from "./dashboard-data-view";
import { AlertCircle, X } from "lucide-react";
import client from "@/lib/axios-client";

interface DashboardClientProps {
  userName: string;
  invoices: InvoiceListItem[];
  metrics: DashboardMetrics;
  integrationError: string | null;
}

const ErrorBanner = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
    <div className="flex">
      <div className="flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-red-700">
          {message} -{" "}
          <Link href="/integrations" className="font-medium underline hover:text-red-600">
            Go to Integrations
          </Link>
        </p>
      </div>
      <div className="ml-auto pl-3">
        <div className="-mx-1.5 -my-1.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardClient({
  userName,
  invoices,
  metrics,
  integrationError,
}: DashboardClientProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const fetchInvoiceDetails = useCallback(async (invoiceId: number) => {
    setIsLoadingDetails(true);
    try {
      const response = await client.get<{ success: boolean; data: InvoiceDetails }>(
        `api/v1/invoice/invoices/${invoiceId}`
      );
      // axios interceptor returns response.data, which contains { success, data }
      setSelectedInvoice(response.data.data);
    } catch (error) {
      console.error(`Failed to fetch details for invoice ${invoiceId}:`, error);
      setSelectedInvoice(null);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    const initialInvoice = invoices?.[0];
    if (initialInvoice) {
      fetchInvoiceDetails(initialInvoice.id);
    }
  }, [invoices, fetchInvoiceDetails]);

  const handleSelectInvoice = useCallback(
    (invoiceId: number) => {
      setSelectedInvoice(null);
      fetchInvoiceDetails(invoiceId);
    },
    [fetchInvoiceDetails]
  );

  if (!invoices || invoices.length === 0) {
    return <EmptyState userName={userName} />;
  }

  return (
    <div>
      {integrationError && (
        <ErrorBanner
          message={integrationError}
          onClose={() => {
            // Error banner can be dismissed, but we'll keep it simple for now
          }}
        />
      )}
      <DashboardDataView
        invoices={invoices}
        metrics={metrics}
        selectedInvoice={selectedInvoice}
        onSelectInvoice={handleSelectInvoice}
        isLoading={isLoadingDetails}
      />
    </div>
  );
}
