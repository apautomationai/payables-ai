
// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import InvoiceList from "./invoice-list";
// import PdfViewer from "./pdf-viewer";
// import InvoiceDetailsForm from "./invoice-details-form";
// import type { Attachment, InvoiceDetails } from "@/lib/types/invoice";

// export default function InvoiceReviewClient({
//   attachments,
//   initialInvoiceDetails,
// }: {
//   attachments: Attachment[];
//   initialInvoiceDetails: InvoiceDetails;
// }) {
//   const [isClient, setIsClient] = useState(false);
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const [selectedAttachmentId, setSelectedAttachmentId] = useState<string | null>(
//     attachments.length > 0 ? attachments[0]!.id : null
//   );

//   const selectedAttachment = useMemo(
//     () => attachments.find((att) => att.id === selectedAttachmentId) || null,
//     [attachments, selectedAttachmentId]
//   );
  
//   const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(initialInvoiceDetails);
//   const [selectedFields, setSelectedFields] = useState<string[]>(() =>
//     initialInvoiceDetails ? Object.keys(initialInvoiceDetails) : []
//   );
//   const [isEditing, setIsEditing] = useState(false);
//   const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);

//   useEffect(() => {
//     return () => {
//       if (uploadedPdfUrl) {
//         URL.revokeObjectURL(uploadedPdfUrl);
//       }
//     };
//   }, [uploadedPdfUrl]);

//   const handleSelectAttachment = (attachment: Attachment) => {
//     setSelectedAttachmentId(attachment.id);
//     setUploadedPdfUrl(null); 
//   };
  
//   const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     if (!invoiceDetails) return;
//     const { name, value } = e.target;
//     setInvoiceDetails((prevDetails) =>
//       prevDetails ? { ...prevDetails, [name]: value } : null
//     );
//   };

//   const handleFileUpload = (file: File) => {
//     if (uploadedPdfUrl) {
//       URL.revokeObjectURL(uploadedPdfUrl);
//     }
//     const url = URL.createObjectURL(file);
//     setUploadedPdfUrl(url);
//   };

//   if (!isClient) return null;

//   return (
//     <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-4 md:grid-cols-12">
//       <div className="md:col-span-3">
//         <InvoiceList
//           attachments={attachments}
//           selectedAttachment={selectedAttachment}
//           onSelectAttachment={handleSelectAttachment}
//           onFileUpload={handleFileUpload}
//         />
//       </div>
//       <div className="md:col-span-5">
//         {selectedAttachment ? (
//             <PdfViewer
//               attachment={selectedAttachment}
//               pdfUrl={uploadedPdfUrl || selectedAttachment.s3Url}
//             />
//         ) : (
//           <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
//              <p>Select or upload an invoice to begin.</p>
//           </div>
//         )}
//       </div>
//       <div className="md:col-span-4">
//         {invoiceDetails ? (
//            <InvoiceDetailsForm
//               invoiceDetails={invoiceDetails}
//               isEditing={isEditing}
//               setIsEditing={setIsEditing}
//               onDetailsChange={handleDetailsChange}
//               selectedFields={selectedFields}
//               setSelectedFields={setSelectedFields}
//             />
//         ) : (
//            <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
//               <p>Could not load invoice details.</p>
//             </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useMemo, useEffect } from "react";
import InvoiceList from "./invoice-list";
import PdfViewer from "./pdf-viewer";
import InvoiceDetailsForm from "./invoice-details-form";
import type { Attachment, InvoiceDetails } from "@/lib/types/invoice";

export default function InvoiceReviewClient({
  attachments,
  initialInvoiceDetails,
  currentPage,
}: {
  attachments: Attachment[];
  initialInvoiceDetails: InvoiceDetails;
  currentPage: number;
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [selectedAttachmentId, setSelectedAttachmentId] = useState<string | null>(
    attachments.length > 0 ? attachments[0]!.id : null
  );

  const selectedAttachment = useMemo(
    () => attachments.find((att) => att.id === selectedAttachmentId) || null,
    [attachments, selectedAttachmentId]
  );
  
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(initialInvoiceDetails);
  const [selectedFields, setSelectedFields] = useState<string[]>(() =>
    initialInvoiceDetails ? Object.keys(initialInvoiceDetails) : []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (uploadedPdfUrl) {
        URL.revokeObjectURL(uploadedPdfUrl);
      }
    };
  }, [uploadedPdfUrl]);

  const handleSelectAttachment = (attachment: Attachment) => {
    setSelectedAttachmentId(attachment.id);
    setUploadedPdfUrl(null); 
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!invoiceDetails) return;
    const { name, value } = e.target;
    setInvoiceDetails((prevDetails) =>
      prevDetails ? { ...prevDetails, [name]: value } : null
    );
  };

  const handleFileUpload = (file: File) => {
    if (uploadedPdfUrl) {
      URL.revokeObjectURL(uploadedPdfUrl);
    }
    const url = URL.createObjectURL(file);
    setUploadedPdfUrl(url);
  };

  if (!isClient) return null;

  return (
    <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-3">
        <InvoiceList
          attachments={attachments}
          selectedAttachment={selectedAttachment}
          onSelectAttachment={handleSelectAttachment}
          onFileUpload={handleFileUpload}
          currentPage={currentPage}
        />
      </div>
      <div className="md:col-span-5">
        {selectedAttachment ? (
            <PdfViewer
              attachment={selectedAttachment}
              pdfUrl={uploadedPdfUrl || selectedAttachment.s3Url}
            />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
             <p>Select or upload an invoice to begin.</p>
          </div>
        )}
      </div>
      <div className="md:col-span-4">
        {invoiceDetails ? (
           <InvoiceDetailsForm
              invoiceDetails={invoiceDetails}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onDetailsChange={handleDetailsChange}
              selectedFields={selectedFields}
              setSelectedFields={setSelectedFields}
            />
        ) : (
           <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
              <p>Could not load invoice details.</p>
            </div>
        )}
      </div>
    </div>
  );
}