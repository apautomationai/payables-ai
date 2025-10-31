"use client";

import React, { useState, useEffect } from "react";
import { InvoiceDetails, DashboardMetrics } from "@/lib/types";
import EmptyState from "./empty-state";
import DashboardDataView from "./dashboard-data-view";
import ErrorBanner from "./error-banner";

interface DashboardClientProps {
  userName: string;
  invoices: InvoiceDetails[];
  metrics: DashboardMetrics;
  integrationError: string | null;
}

export default function DashboardClient({
  userName,
  invoices,
  metrics,
  integrationError,
}: DashboardClientProps) {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

  const selectedInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0] || null;

  useEffect(() => {
    if (invoices.length > 0 && !selectedInvoiceId && invoices[0]) {
      setSelectedInvoiceId(invoices[0].id);
    }
  }, [invoices, selectedInvoiceId]);

  if (invoices.length === 0) {
    return <EmptyState userName={userName} />;
  }

  return (
    <div>
      {integrationError && (
        <ErrorBanner message={integrationError} onClose={() => {}} />
      )}
      <DashboardDataView
        invoices={invoices}
        metrics={metrics}
        selectedInvoice={selectedInvoice}
        onSelectInvoice={setSelectedInvoiceId}
      />
    </div>
  );
}
