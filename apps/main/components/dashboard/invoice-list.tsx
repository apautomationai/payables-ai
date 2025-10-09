"use client";

import React from "react";
import Link from "next/link";
import { InvoiceListItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { FileText, Building, CalendarDays } from "lucide-react"; // Icons updated

interface InvoiceListProps {
  invoices: InvoiceListItem[];
  selectedInvoiceId: number | null;
  onSelectInvoice: (invoiceId: number) => void;
}

export default function InvoiceList({
  invoices,
  selectedInvoiceId,
  onSelectInvoice,
}: InvoiceListProps) {
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  // Helper function to format the date and time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Invoices</CardTitle>
          <Link href="/invoice-review" passHref>
            <Button variant="link" className="p-0 h-auto text-sm">
              View all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="divide-y divide-border/40">
            {safeInvoices.length > 0 ? (
              safeInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => onSelectInvoice(invoice.id)}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedInvoiceId === invoice.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* --- Row 1: Invoice Number --- */}
                      <p className="flex items-center gap-2 text-sm font-semibold text-primary truncate">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate" title={invoice.invoiceNumber}>
                          {invoice.invoiceNumber || `ID: ${invoice.id}`}
                        </span>
                      </p>
                      {/* --- Row 2: Vendor --- */}
                      <p className="flex items-center gap-2 text-xs text-muted-foreground mt-1 truncate">
                        <Building className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          Vendor: {invoice.vendorName || "Unknown"}
                        </span>
                      </p>
                      {/* --- Row 3: Date and Time --- */}
                      <p className="flex items-center gap-2 text-xs text-muted-foreground mt-1 truncate">
                        <CalendarDays className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {formatDateTime(invoice.createdAt)}
                        </span>
                      </p>
                    </div>

                    {/* --- Status Badge --- */}
                    {invoice.status && (
                       <Badge
                         variant={invoice.status === 'approved' ? 'default' : 'outline'}
                         className={cn("ml-2 flex-shrink-0 capitalize", {
                           "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300": invoice.status === 'approved',
                           "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300": invoice.status === 'pending',
                           "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300": invoice.status === 'rejected',
                           "border-none text-xs font-semibold": true,
                         })}
                       >
                         {invoice.status}
                       </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <p>No invoices found.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

