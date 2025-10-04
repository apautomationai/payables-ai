
import React, { useState } from "react";

interface InvoicePdfViewerProps {
  invoicePdfUrl: string;
  sourcePdfUrl?: string | null;
}

export default function InvoicePdfViewer({ 
  invoicePdfUrl, 
  sourcePdfUrl 
}: InvoicePdfViewerProps) {
  const [activeTab, setActiveTab] = useState<'invoice' | 'source'>('invoice');

  const currentUrl = activeTab === 'invoice' ? invoicePdfUrl : sourcePdfUrl;

  const TabButton = ({
    label,
    tabName,
  }: {
    label: string;
    tabName: 'invoice' | 'source';
  }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-3 text-sm font-semibold relative transition-colors duration-200 ${
        activeTab === tabName
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      {activeTab === tabName && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full w-full rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center border-b px-2">
        <TabButton label="Invoice PDF" tabName="invoice" />
        {sourcePdfUrl && <TabButton label="Source" tabName="source" />}
      </div>

      <div className="flex-grow bg-muted/20">
        {currentUrl ? (
          <iframe
            key={currentUrl}
            src={currentUrl}
            className="h-full w-full border-0"
            title="PDF Viewer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>PDF could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}