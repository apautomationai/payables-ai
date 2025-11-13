"use client";

import React, { useState } from "react";
import { DashboardMetrics } from "@/lib/types";
import StatsCards from "./stats-cards";
import DateRangeSelector, { DateRangeType } from "./date-range-selector";
import InvoiceStatusChart from "./invoice-status-chart";
import InvoiceTrendChart from "./invoice-trend-chart";

interface DashboardDataViewProps {
  metrics: DashboardMetrics;
  onDateRangeChange: (dateRange: DateRangeType) => void;
  isLoading: boolean;
}

export default function DashboardDataView({
  metrics,
  onDateRangeChange,
  isLoading,
}: DashboardDataViewProps) {
  const [dateRange, setDateRange] = useState<DateRangeType>("monthly");

  const handleDateRangeChange = (newRange: DateRangeType) => {
    setDateRange(newRange);
    onDateRangeChange(newRange);
  };

  return (
    <div className="flex flex-col h-full min-h-screen overflow-hidden">
      <header className="flex items-center justify-between py-2 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your accounts payable workflow and pending invoices.
          </p>
        </div>
        <DateRangeSelector
          selectedRange={dateRange}
          onRangeChange={handleDateRangeChange}
        />
      </header>

      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <StatsCards metrics={metrics} dateRange={dateRange} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <InvoiceStatusChart metrics={metrics} dateRange={dateRange} />
          <InvoiceTrendChart dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
}