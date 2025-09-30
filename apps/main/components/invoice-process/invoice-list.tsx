// "use client";

// import React, { useState, useMemo } from "react";
// import { ScrollArea } from "@workspace/ui/components/scroll-area";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@workspace/ui/components/card";
// import { Input } from "@workspace/ui/components/input";
// import { Search, FileText } from "lucide-react";
// import type { Attachment } from "@/lib/types/invoice";
// import { cn } from "@workspace/ui/lib/utils";
// import PdfUploader from "./pdf-uploader";
// import { formatDistanceToNow } from "date-fns";

// // Component for the "Supported" / "Not Supported" status
// const SupportStatus = ({ isSupported }: { isSupported: boolean }) => (
//   <div className="flex items-center gap-1.5">
//     <span className={cn("h-2 w-2 rounded-full", isSupported ? "bg-green-500" : "bg-red-500")} />
//     <span className="text-xs text-muted-foreground">
//       {isSupported ? "Supported" : "Not Supported"}
//     </span>
//   </div>
// );

// // Component for the "Pending" processing status
// const ProcessingStatus = () => (
//     <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
//       Pending
//     </span>
// );


// export default function InvoiceList({
//   attachments,
//   selectedAttachment,
//   onSelectAttachment,
//   onFileUpload,
// }: {
//   attachments: Attachment[] | null;
//   selectedAttachment: Attachment | null;
//   onSelectAttachment: (attachment: Attachment) => void;
//   onFileUpload: (file: File) => void;
// }) {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredAttachments = useMemo(() => {
//     if (!attachments) return [];
//     if (!searchTerm.trim()) return attachments;

//     const lowercasedFilter = searchTerm.toLowerCase();
//     return attachments.filter(
//       (attachment) =>
//         attachment.filename.toLowerCase().includes(lowercasedFilter) ||
//         attachment.id.toLowerCase().includes(lowercasedFilter)
//     );
//   }, [attachments, searchTerm]);

//   return (
//     <Card className="h-[calc(100vh-10rem)] flex flex-col">
//       <CardHeader>
//         <CardTitle>Upload & Review</CardTitle>
//         <div className="mt-4">
//           <PdfUploader onFileUpload={onFileUpload} />
//         </div>
//       </CardHeader>
//       <CardContent className="flex-1 flex flex-col min-h-0">
//         <div className="relative mb-4">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search by name or ID..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
        
//         <ScrollArea className="flex-1 -mx-2">
//           <div className="flex flex-col space-y-1 p-2">
//             {filteredAttachments.length > 0 ? (
//               filteredAttachments.map((attachment) => {
//                 const isSupported = attachment.mimeType === "application/pdf";
//                 return (
//                   <button
//                     key={attachment.id}
//                     onClick={() => onSelectAttachment(attachment)}
//                     className={cn(
//                       "flex items-center gap-3 rounded-md p-2.5 text-left transition-colors hover:bg-muted",
//                       selectedAttachment?.id === attachment.id && "bg-muted"
//                     )}
//                   >
//                     <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
//                     <div className="flex-1 min-w-0">
//                       {/* --- TOP ROW --- */}
//                       <div className="flex items-center justify-between gap-2">
//                         <p className="font-semibold text-sm truncate" title={attachment.filename}>
//                           {attachment.filename}
//                         </p>
//                         <ProcessingStatus />
//                       </div>
//                       {/* --- BOTTOM ROW --- */}
//                       <div className="flex items-center justify-between text-xs text-muted-foreground mt-1.5">
//                         <p className="truncate" title={attachment.id}>
//                           ID: {attachment.id.substring(0, 8)}...
//                         </p>
//                         <div className="flex items-center gap-2 flex-shrink-0">
//                           <SupportStatus isSupported={isSupported} />
//                           <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
//                           <span title={new Date(attachment.created_at).toLocaleString()}>
//                             {formatDistanceToNow(new Date(attachment.created_at), { addSuffix: true })}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })
//             ) : (
//               <div className="text-center text-sm text-muted-foreground py-10">
//                 {searchTerm ? "No results found." : "No invoices to display."}
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import React, { useState, useMemo } from "react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search, FileText } from "lucide-react";
import type { Attachment } from "@/lib/types/invoice";
import { cn } from "@workspace/ui/lib/utils";
import PdfUploader from "./pdf-uploader";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Component for the "Supported" / "Not Supported" status
const SupportStatus = ({ isSupported }: { isSupported: boolean }) => (
  <div className="flex items-center gap-1.5">
    <span className={cn("h-2 w-2 rounded-full", isSupported ? "bg-green-500" : "bg-red-500")} />
    <span className="text-xs text-muted-foreground">
      {isSupported ? "Supported" : "Not Supported"}
    </span>
  </div>
);

// Component for the "Pending" processing status
const ProcessingStatus = () => (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
      Pending
    </span>
);

export default function InvoiceList({
  attachments,
  selectedAttachment,
  onSelectAttachment,
  onFileUpload,
  currentPage,
}: {
  attachments: Attachment[] | null;
  selectedAttachment: Attachment | null;
  onSelectAttachment: (attachment: Attachment) => void;
  onFileUpload: (file: File) => void;
  currentPage: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAttachments = useMemo(() => {
    if (!attachments) return [];
    if (!searchTerm.trim()) return attachments;

    const lowercasedFilter = searchTerm.toLowerCase();
    return attachments.filter(
      (attachment) =>
        attachment.filename.toLowerCase().includes(lowercasedFilter) ||
        attachment.id.toLowerCase().includes(lowercasedFilter)
    );
  }, [attachments, searchTerm]);

  const hasNextPage = attachments ? attachments.length === 20 : false;
  const hasPreviousPage = currentPage > 1;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Upload & Review</CardTitle>
        <div className="mt-4">
          <PdfUploader onFileUpload={onFileUpload} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="flex-1 -mx-2">
          <div className="flex flex-col space-y-1 p-2">
            {filteredAttachments.length > 0 ? (
              filteredAttachments.map((attachment) => {
                const isSupported = attachment.mimeType === "application/pdf";
                
                const displayName =
                  attachment.filename.length > 25
                    ? `${attachment.filename.substring(0, 22)}...`
                    : attachment.filename;

                return (
                  <button
                    key={attachment.id}
                    onClick={() => onSelectAttachment(attachment)}
                    className={cn(
                      "flex items-center gap-3 rounded-md p-2.5 text-left transition-colors hover:bg-muted",
                      selectedAttachment?.id === attachment.id && "bg-muted"
                    )}
                  >
                    <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm truncate" title={attachment.filename}>
                          {displayName}
                        </p>
                        <ProcessingStatus />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1.5">
                        <p className="truncate" title={attachment.id}>
                          ID: {attachment.id.substring(0, 8)}...
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <SupportStatus isSupported={isSupported} />
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                          <span title={new Date(attachment.created_at).toLocaleString()}>
                            {formatDistanceToNow(new Date(attachment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center text-sm text-muted-foreground py-10">
                {searchTerm ? "No results found." : "No invoices found."}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-2 flex justify-between">
        <Button asChild variant="outline" size="sm" disabled={!hasPreviousPage}>
          <Link href={`/invoice-review?page=${currentPage - 1}`}>Previous</Link>
        </Button>
        <span className="text-sm text-muted-foreground">Page {currentPage}</span>
        <Button asChild variant="outline" size="sm" disabled={!hasNextPage}>
          <Link href={`/invoice-review?page=${currentPage + 1}`}>Next</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}