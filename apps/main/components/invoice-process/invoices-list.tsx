
import React, { useState, useMemo } from "react";
import type { InvoiceListItem } from "@/lib/types/invoice";

interface InvoicesListProps {
  invoices: InvoiceListItem[];
  selectedInvoiceId: string | null;
  onSelectInvoice: (invoice: InvoiceListItem) => void;
}

// A small component for status badges
const StatusBadge = ({ status }: { status: InvoiceListItem["status"] }) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
  const statusClasses = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    "Requires Attention": "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

// Function to format the date and time
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export default function InvoicesList({
  invoices,
  selectedInvoiceId,
  onSelectInvoice,
}: InvoicesListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    return invoices.filter(
      (invoice) =>
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [invoices, searchQuery]);

  return (
    <div className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <div className="relative mt-2">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, number, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border bg-background rounded-md text-sm focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-2">
        {filteredInvoices.length > 0 ? (
          <ul className="space-y-2">
            {filteredInvoices.map((invoice) => (
              <li
                key={invoice.id}
                onClick={() => onSelectInvoice(invoice)}
                className={`p-3 rounded-md cursor-pointer transition-all duration-150 border-l-4 ${
                  selectedInvoiceId === invoice.id
                    ? "bg-primary/10 border-primary"
                    : "border-transparent hover:bg-muted/50"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-sm truncate">{invoice.number}</p>
                  <StatusBadge status={invoice.status} />
                </div>
                <p className="text-sm text-muted-foreground truncate mb-2">{invoice.vendorName}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{formatDateTime(invoice.date)}</span>
                  <span>ID: {invoice.id}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center mt-8">
            No invoices found.
          </p>
        )}
      </div>
    </div>
  );
}