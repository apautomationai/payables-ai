"use client";

import React, { useState, useEffect, useCallback } from "react";
import { InvoiceDetails, DashboardMetrics } from "@/lib/types";
import { useRealtimeInvoices } from "@/hooks/use-realtime-invoices";
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
  invoices: initialInvoices,
  metrics,
  integrationError,
}: DashboardClientProps) {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDetails[]>(initialInvoices);

  // Update invoices when initial data changes
  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const selectedInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0] || null;

  // Set up real-time WebSocket connection for dashboard
  // Function to refresh dashboard data
  const refreshDashboardData = useCallback(() => {
    window.location.reload();
  }, []);

  const { joinDashboard, leaveDashboard } = useRealtimeInvoices({
    onRefreshNeeded: refreshDashboardData,
    enableToasts: true,
    autoConnect: true,
  });

  // Join dashboard room when component mounts, leave when unmounts
  useEffect(() => {
    joinDashboard();

    return () => {
      leaveDashboard();
    };
  }, [joinDashboard, leaveDashboard]);

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
        <ErrorBanner message={integrationError} onClose={() => { }} />
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
