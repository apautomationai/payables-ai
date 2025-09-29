// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import InvoiceList from "./invoice-list";
// import PdfViewer from "./pdf-viewer";
// import InvoiceDetailsForm from "./invoice-details-form";
// import { InvoiceListItem, InvoiceDetails } from "@/lib/types/invoice";
// import { mockInvoiceDetails } from "@/data/invoice-data";

// export default function InvoiceReviewClient({
//   invoices,
//   initialInvoiceDetails,
// }: {
//   invoices: InvoiceListItem[];
//   initialInvoiceDetails: InvoiceDetails;
// }) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
//     invoices[0]!.id
//   );
//   const selectedInvoice = useMemo(
//     () => invoices.find((invoice) => invoice.id === selectedInvoiceId)!,
//     [invoices, selectedInvoiceId]
//   );

//   const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
//     initialInvoiceDetails
//   );
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

//   const handleSelectInvoice = (invoice: InvoiceListItem) => {
//     setSelectedInvoiceId(invoice.id);
//     const details = mockInvoiceDetails[invoice.id];
//     setInvoiceDetails(details || null);
//     setSelectedFields(details ? Object.keys(details) : []);
//     setIsEditing(false);
//     setUploadedPdfUrl(null);
//   };

//   const handleDetailsChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     if (!invoiceDetails) return;
//     const { name, value } = e.target;
//     setInvoiceDetails((prevDetails) =>
//       prevDetails ? { ...prevDetails, [name]: value } : null
//     );
//   };

//   // This handler now correctly accepts a File object
//   const handleFileUpload = (file: File) => {
//     if (uploadedPdfUrl) {
//       URL.revokeObjectURL(uploadedPdfUrl);
//     }
//     const url = URL.createObjectURL(file);
//     setUploadedPdfUrl(url);
//     console.log("File uploaded and ready for viewing:", file.name);
//   };

//   if (!isClient) {
//     return null;
//   }

//   if (!invoices || invoices.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full col-span-full">
//         <p className="text-muted-foreground">No invoices to display.</p>
//       </div>
//     );
//   }

//   if (!selectedInvoice) {
//     return (
//       <div className="flex items-center justify-center h-full col-span-full">
//         <p className="text-red-500">
//           Error: Could not find the selected invoice.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid h-96 grid-cols-1 gap-4 md:grid-cols-12">
//       <div className="md:col-span-3 lg:col-span-3">
//         <InvoiceList
//           invoices={invoices}
//           selectedInvoice={selectedInvoice}
//           onSelectInvoice={handleSelectInvoice}
//           onFileUpload={handleFileUpload}
//         />
//       </div>
//       {invoiceDetails ? (
//         <>
//           <div className="md:col-span-5 lg:col-span-5">
//             <PdfViewer
//               invoice={invoiceDetails}
//               pdfUrl={uploadedPdfUrl || invoiceDetails.pdfUrl}
//             />
//           </div>
//           <div className="md:col-span-4 lg:col-span-4">
//             <InvoiceDetailsForm
//               invoiceDetails={invoiceDetails}
//               isEditing={isEditing}
//               setIsEditing={setIsEditing}
//               onDetailsChange={handleDetailsChange}
//               selectedFields={selectedFields}
//               setSelectedFields={setSelectedFields}
//             />
//           </div>
//         </>
//       ) : (
//         <div className="md:col-span-9 flex items-center justify-center text-muted-foreground">
//           <p>Could not load details for the selected invoice.</p>
//         </div>
//       )}
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
}: {
  attachments: Attachment[];
  initialInvoiceDetails: InvoiceDetails;
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