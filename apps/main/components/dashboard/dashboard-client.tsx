"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { InvoiceDetails, DashboardMetrics } from "@/lib/types";
import EmptyState from "./empty-state";
import DashboardDataView from "./dashboard-data-view";
import { AlertCircle, X } from "lucide-react";

interface DashboardClientProps {
  userName: string;
  invoices: InvoiceDetails[];
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
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

  // Find selected invoice from the already-fetched data
  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0] || null;

  useEffect(() => {
    // Set initial selection to first invoice
    if (invoices.length > 0 && !selectedInvoiceId) {
      const firstInvoice = invoices[0];
      if (firstInvoice) {
        setSelectedInvoiceId(firstInvoice.id);
      }
    }
  }, [invoices, selectedInvoiceId]);

  const handleSelectInvoice = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
  };

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
        isLoading={false}
      />
    </div>
  );
}
