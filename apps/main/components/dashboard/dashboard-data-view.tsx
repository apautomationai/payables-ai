
"use client";

import React from "react";
import { InvoiceListItem, InvoiceDetails } from "@/lib/types";
import { Button } from "@workspace/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Plus } from "lucide-react";
import Link from "next/link";
import StatsCards from "./stats-cards";
import InvoiceList from "./invoice-list";
import AttachmentViewer from "./attachment-viewer";
import InvoiceDetailsComponent from "@/components/dashboard/invoice-list-details";
import NewInvoiceButton from "./new-invoice-button";

interface DashboardDataViewProps {
  invoices: InvoiceListItem[];
  selectedInvoice: InvoiceDetails | null;
  onSelectInvoice: (invoiceId: number) => void;
  isLoading: boolean;
}

export default function DashboardDataView({
  invoices,
  selectedInvoice,
  onSelectInvoice,
  isLoading,
}: DashboardDataViewProps) {
  return (
    <div className="flex flex-col h-full min-h-screen overflow-hidden">
      <header className="flex items-center justify-between py-2 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your accounts payable workflow and pending invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          
          <NewInvoiceButton />
        </div>
      </header>

      <StatsCards invoices={invoices} />

      <main className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4 flex-1 overflow-hidden">
        <div className="md:col-span-2 flex flex-col h-full">
          <InvoiceList
            invoices={invoices}
            selectedInvoiceId={selectedInvoice?.id || null}
            onSelectInvoice={onSelectInvoice}
          />
        </div>
        
        <div className="md:col-span-3 hidden md:flex flex-col h-full">
          <Tabs defaultValue="document" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="document" className="flex-1 overflow-hidden mt-2">
              <AttachmentViewer selectedInvoice={selectedInvoice} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="details" className="flex-1 overflow-hidden mt-2">
              <InvoiceDetailsComponent invoice={selectedInvoice} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}