// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { client } from "@/lib/axios-client"; // Your authenticated Axios client
// import axios from "axios"; // Base axios for the unauthenticated call
// import InvoiceList from "./invoice-list";
// import PdfViewer from "./pdf-viewer";
// import InvoiceDetailsForm from "./invoice-details-form";
// import type { Attachment, InvoiceDetails } from "@/lib/types/invoice";

// // Helper function to read a file and convert it to a Base64URL string
// const fileToBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       const base64String = (reader.result as string).split(",")[1];
//       if (base64String) {
//         const base64Url = base64String.replace(/\+/g, '-').replace(/\//g, '_');
//         resolve(base64Url);
//       } else {
//         reject(new Error("Failed to read file as Base64"));
//       }
//     };
//     reader.onerror = (error) => reject(error);
//   });

// export default function InvoiceReviewClient({
//   attachments,
//   initialInvoiceDetails,
//   currentPage,
//   totalPages,
// }: {
//   attachments: Attachment[];
//   initialInvoiceDetails: InvoiceDetails;
//   currentPage: number;
//   totalPages: number;
// }) {
//   const [isClient, setIsClient] = useState(false);
//   const router = useRouter();

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
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

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

//   const handleFileUpload = async (file: File) => {
//     if (uploadedPdfUrl) URL.revokeObjectURL(uploadedPdfUrl);
//     const url = URL.createObjectURL(file);
//     setUploadedPdfUrl(url);
//     setSelectedAttachmentId(null);

//     setIsUploading(true);
//     const uploadToast = toast.loading("Processing and uploading file...");

//     try {
//       // Step 1: Convert file to Base64URL string
//       const base64File = await fileToBase64(file);

//       // Step 2: Send the Base64 string using the base axios client
//       const uploadResponse = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/upload-attachment`, 
//         base64File,
//         {
//           headers: {
//             "Content-Type": file.type,
//             "X-Filename": file.name,
//           },
//         }
//       );

//       const uploadResult = uploadResponse.data;
//       if (uploadResponse.status !== 200) {
//         throw new Error(uploadResult.message || "File upload failed");
//       }

//       toast.loading("Creating database record...", { id: uploadToast });

//       // Step 3: Create the database record using your authenticated axios-client
//       await client.post("/api/v1/upload/create-record", {
//         hash: uploadResult.data.hash,
//         filename: uploadResult.data.filename,
//         mimetype: uploadResult.data.mimetype,
//         s3Url: uploadResult.data.s3Url,
//       });

//       toast.success("Attachment processed successfully!", { id: uploadToast });
//       router.refresh();

//     } catch (error: any) {
//       // console.error("Upload Process Error:", error);
//       const message = error.response?.data?.message || "An unexpected error occurred.";
//       toast.error(message, { id: uploadToast });
//     } finally {
//       setIsUploading(false);
//     }
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
//           currentPage={currentPage}
//           totalPages={totalPages}
//           isUploading={isUploading}
//         />
//       </div>
//       <div className="md:col-span-5">
//         {uploadedPdfUrl || selectedAttachment ? (
//           <PdfViewer
//             attachment={selectedAttachment}
//             pdfUrl={uploadedPdfUrl || selectedAttachment!.s3Url}
//           />
//         ) : (
//           <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
//             <p>Select or upload an invoice to begin.</p>
//           </div>
//         )}
//       </div>
//       <div className="md:col-span-4">
//         {invoiceDetails ? (
//           <InvoiceDetailsForm
//             invoiceDetails={invoiceDetails}
//             isEditing={isEditing}
//             setIsEditing={setIsEditing}
//             onDetailsChange={handleDetailsChange}
//             selectedFields={selectedFields}
//             setSelectedFields={setSelectedFields}
//           />
//         ) : (
//           <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
//             <p>Could not load invoice details.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/lib/axios-client"; // Your authenticated Axios client
import axios from "axios"; // Base axios for the unauthenticated call
import InvoiceList from "./invoice-list";
import PdfViewer from "./pdf-viewer";
import InvoiceDetailsForm from "./invoice-details-form";
import type { Attachment, InvoiceDetails } from "@/lib/types/invoice";

// Helper function to read a file and convert it to a Base64URL string
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      if (base64String) {
        // Convert standard Base64 to Base64URL for backend compatibility
        const base64Url = base64String.replace(/\+/g, '-').replace(/\//g, '_');
        resolve(base64Url);
      } else {
        reject(new Error("Failed to read file as Base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });

export default function InvoiceReviewClient({
  attachments,
  initialInvoiceDetails,
  currentPage,
  totalPages,
}: {
  attachments: Attachment[];
  initialInvoiceDetails: InvoiceDetails;
  currentPage: number;
  totalPages: number;
}) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

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
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handleFileUpload = async (file: File) => {
    if (uploadedPdfUrl) URL.revokeObjectURL(uploadedPdfUrl);
    const url = URL.createObjectURL(file); // For local preview
    setUploadedPdfUrl(url);
    setSelectedAttachmentId(null);

    setIsUploading(true);
    const uploadToast = toast.loading("Processing and uploading file...");

    try {
      // Step 1: Convert the file to a Base64URL string as required by the backend
      const base64File = await fileToBase64(file);

      // Step 2: Send the Base64 string to the unauthenticated endpoint
      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/upload-attachment`,
        base64File,
        {
          headers: {
            "Content-Type": "application/pdf",
            "X-Filename": file.name,
            "X-Mimetype": file.type, // Send original mime type in a custom header
          },
        }
      );

      const uploadResult = uploadResponse.data;
      if (uploadResponse.status !== 200) {
        throw new Error(uploadResult.message || "File upload failed");
      }

      toast.loading("Creating database record...", { id: uploadToast });

      // Step 3: Create the database record using your authenticated axios-client
      await client.post("/api/v1/upload/create-record", {
        hash: uploadResult.data.hash,
        filename: uploadResult.data.filename,
        mimetype: uploadResult.data.mimetype,
        s3Url: uploadResult.data.s3Url,
      });

      toast.success("Attachment processed successfully!", { id: uploadToast });
      router.refresh();

    } catch (error: any) {
      console.error("Upload Process Error:", error);
      const message = error.response?.data?.message || "An unexpected error occurred.";
      toast.error(message, { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
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
          totalPages={totalPages}
          isUploading={isUploading}
        />
      </div>
      <div className="md:col-span-5">
        {uploadedPdfUrl || selectedAttachment ? (
          <PdfViewer
            attachment={selectedAttachment}
            pdfUrl={uploadedPdfUrl || selectedAttachment!.s3Url}
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