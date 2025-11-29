import React, { useState, useMemo } from "react";
import type { InvoiceListItem, InvoiceStatus } from "@/lib/types/invoice";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { Trash2, Copy, MoreVertical } from "lucide-react";

const StatusBadge = ({ status }: { status: InvoiceStatus | null }) => {
  if (!status) return null;

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    failed: "bg-gray-100 text-gray-800 border-gray-200",
    not_connected: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", statusStyles[status])}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

interface InvoicesListProps {
  invoices: InvoiceListItem[];
  selectedInvoiceId: number | null;
  onSelectInvoice: (invoice: InvoiceListItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDeleteInvoice?: (invoiceId: number) => void;
  onCloneInvoice?: (invoiceId: number) => void;
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return "Invalid Date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

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
  currentPage,
  totalPages,
  onPageChange,
  onDeleteInvoice,
  onCloneInvoice,
}: InvoicesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    const lowercasedQuery = searchQuery.toLowerCase();
    return invoices.filter(
      (invoice) =>
        String(invoice.id).includes(lowercasedQuery) ||
        invoice.invoiceNumber.toLowerCase().includes(lowercasedQuery)
    );
  }, [invoices, searchQuery]);

  // const handleRefresh = async () => {
  //   setIsRefreshing(true);
  //   try {
  //     await router.refresh();
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Invoices</h2>
          {/* <Button variant={'link'} size={'sm'} className="cursor-pointer" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <>
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin " /> <span className="text-sm">Refreshing...</span>
              </>
              : <>
                <RefreshCcw className="w-4 h-4 mr-2" /> <span className="text-sm">Refresh</span>
              </>
            }
        </Button> */}
        </div>
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
            placeholder="Search by ID or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border bg-background rounded-md text-sm focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-2">
          {filteredInvoices.length > 0 ? (
            <ul className="space-y-2 pr-2">
              {filteredInvoices.map((invoice) => (
                <li
                  key={invoice.id}
                  onClick={() => onSelectInvoice(invoice)}
                  className={`group p-3 rounded-md cursor-pointer transition-all duration-150 border-l-4 ${selectedInvoiceId === invoice.id
                    ? "bg-primary/10 border-primary"
                    : "border-transparent hover:bg-muted/50"
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm truncate pr-2">{invoice.invoiceNumber}</p>
                    <StatusBadge status={invoice.status} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">{invoice.vendorName || 'N/A'}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    {/* THIS IS THE FIX: Use 'createdAt' which is available in the list data */}
                    <span>{formatDateTime(invoice.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      <span>ID: {invoice.id}</span>
                      {(onDeleteInvoice || onCloneInvoice) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            {onCloneInvoice && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCloneInvoice(invoice.id);
                                }}
                                className="cursor-pointer"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Clone Invoice
                              </DropdownMenuItem>
                            )}
                            {onDeleteInvoice && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteInvoice(invoice.id);
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Invoice
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
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
      </ScrollArea>

      <div className="p-2 border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                aria-disabled={currentPage <= 1}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                aria-disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

