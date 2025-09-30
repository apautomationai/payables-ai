// import React from "react";
// import { Attachment } from "@/lib/types";
// import StatsCards from "./stats-cards";
// import InvoiceList from "./invoice-list";
// import AttachmentViewer from "./attachment-viewer";
// import { Button } from "@workspace/ui/components/button";
// import { Plus, ListFilter } from "lucide-react";
// import Link from "next/link";

// interface DashboardDataViewProps {
//   attachments: Attachment[];
//   selectedAttachment: Attachment | null;
//   onSelectAttachment: (attachment: Attachment) => void;
// }

// export default function DashboardDataView({
//   attachments,
//   selectedAttachment,
//   onSelectAttachment,
// }: DashboardDataViewProps) {
//   return (
//     <div className="flex flex-col h-full max-h-screen overflow-hidden">
//       {/* Header */}
//       <header className="flex items-center justify-between py-4 flex-shrink-0">
//         <div>
//           <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
//           <p className="text-sm text-muted-foreground">
//             Monitor your accounts payable workflow and pending invoices.
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm">
//             <ListFilter className="h-4 w-4 mr-2" />
//             Filter
//           </Button>
//           <Button size="sm" asChild>
//             <Link href="/invoice-review">
//               <Plus className="h-4 w-4 mr-2" />
//               New Invoice
//             </Link>
//           </Button>
//         </div>
//       </header>

//       {/* Stats Cards */}
//       <StatsCards attachments={attachments} />

//       {/* Main Content: Invoices and Viewer */}
//       <main className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 flex-1 overflow-hidden">
//         <div className="md:col-span-1 flex flex-col h-full">
//           <InvoiceList
//             attachments={attachments}
//             selectedAttachment={selectedAttachment}
//             onSelectAttachment={onSelectAttachment}
//           />
//         </div>
//         <div className="md:col-span-1 hidden md:block h-full">
//           <AttachmentViewer selectedAttachment={selectedAttachment} />
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import React from "react";
import { Attachment } from "@/lib/types";
import { Button } from "@workspace/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Plus, ListFilter } from "lucide-react";
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
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between py-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your accounts payable workflow and pending invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ListFilter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" asChild>
            <Link href="/invoice-review">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Link>
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <StatsCards attachments={attachments} />

      {/* Main Content: Invoices and Viewer */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 flex-1 overflow-hidden">
        <div className="md:col-span-1 flex flex-col h-full">
          <InvoiceList
            attachments={attachments}
            selectedAttachment={selectedAttachment}
            onSelectAttachment={onSelectAttachment}
          />
        </div>
        
        <div className="md:col-span-1 hidden md:flex flex-col h-full">
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