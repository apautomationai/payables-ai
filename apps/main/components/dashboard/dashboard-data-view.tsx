"use client";

import React from "react";
import { Attachment } from "@/lib/types";
import { Button } from "@workspace/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Plus } from "lucide-react";
import Link from "next/link";
import StatsCards from "./stats-cards";
import InvoiceList from "./invoice-list";
import AttachmentViewer from "./attachment-viewer";
import InvoiceDetails from "@/components/dashboard/invoice-list-details";

interface DashboardDataViewProps {
  attachments: Attachment[];
  selectedAttachment: Attachment | null;
  onSelectAttachment: (attachment: Attachment) => void;
}

export default function DashboardDataView({
  attachments,
  selectedAttachment,
  onSelectAttachment,
}: DashboardDataViewProps) {
  return (
    <div className="flex flex-col h-full min-h-screen overflow-hidden">
      {/* --- UPDATED: Reduced vertical padding --- */}
      <header className="flex items-center justify-between py-2 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your accounts payable workflow and pending invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          
          <Button size="sm" asChild>
            <Link href="/invoice-review">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Link>
          </Button>
        </div>
      </header>

      <StatsCards attachments={attachments} />

      {/* --- UPDATED: Reduced top margin --- */}
      <main className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4 flex-1 overflow-hidden">
        <div className="md:col-span-2 flex flex-col h-full">
          <InvoiceList
            attachments={attachments}
            selectedAttachment={selectedAttachment}
            onSelectAttachment={onSelectAttachment}
          />
        </div>
        
        <div className="md:col-span-3 hidden md:flex flex-col h-full">
          <Tabs defaultValue="document" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="document" className="flex-1 overflow-hidden mt-2">
              <AttachmentViewer selectedAttachment={selectedAttachment} />
            </TabsContent>
            
            <TabsContent value="details" className="flex-1 overflow-hidden mt-2">
              <InvoiceDetails attachment={selectedAttachment} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}