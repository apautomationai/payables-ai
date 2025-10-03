"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/lib/axios-client";
import axios from "axios";
import AttachmentsList from "./attachments-list";
import AttachmentViewer from "./attachment-viewer";
import InvoiceDetailsForm from "./invoice-details-form";
import InvoicesList from "./invoices-list";
import InvoicePdfViewer from "./invoice-pdf-viewer";
import type { Attachment, InvoiceDetails, InvoiceListItem } from "@/lib/types/invoice";

// Helper function to convert a file to a Base64URL string
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      if (base64String) {
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
  invoices,
  invoiceDetailsData,
  initialSelectedInvoice,
}: {
  attachments: Attachment[];
  initialInvoiceDetails: InvoiceDetails;
  currentPage: number;
  totalPages: number;
  invoices: InvoiceListItem[];
  invoiceDetailsData: Record<string, InvoiceDetails>;
  initialSelectedInvoice: InvoiceListItem;
}) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"attachments" | "invoices">("attachments");
  
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<string | null>(
    attachments.length > 0 ? attachments[0]!.id : null
  );
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(initialSelectedInvoice.id);

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    invoiceDetailsData[initialSelectedInvoice.id] ?? null
  );
  const [selectedFields, setSelectedFields] = useState<string[]>(() =>
    initialInvoiceDetails ? Object.keys(initialInvoiceDetails) : []
  );
  const [isEditing, setIsEditing] = useState(false);
  
  const selectedAttachment = useMemo(
    () => attachments.find((att) => att.id === selectedAttachmentId) || null,
    [attachments, selectedAttachmentId]
  );
  
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
  
  const handleSelectInvoice = (invoice: InvoiceListItem) => {
    setSelectedInvoiceId(invoice.id);
    setInvoiceDetails(invoiceDetailsData[invoice.id] ?? null);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!invoiceDetails) return;
    const { name, value } = e.target;
    setInvoiceDetails((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileUpload = async (file: File) => {
    if (uploadedPdfUrl) URL.revokeObjectURL(uploadedPdfUrl);
    const url = URL.createObjectURL(file);
    setUploadedPdfUrl(url);
    setSelectedAttachmentId(null);
    setIsUploading(true);
    const uploadToast = toast.loading("Processing and uploading file...");

    try {
      const base64File = await fileToBase64(file);
      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/upload-attachment`,
        base64File,
        {
          headers: {
            "Content-Type": "application/pdf",
            "X-Filename": file.name,
            "X-Mimetype": file.type,
          },
        }
      );

      const uploadResult = uploadResponse.data;
      if (uploadResponse.status !== 200) {
        throw new Error(uploadResult.message || "File upload failed");
      }

      toast.loading("Creating database record...", { id: uploadToast });

      await client.post("/api/v1/upload/create-record", {
        hash: uploadResult.data.hash,
        filename: uploadResult.data.filename,
        mimetype: uploadResult.data.mimetype,
        s3Url: uploadResult.data.s3Url,
      });

      toast.success("Attachment processed successfully!", { id: uploadToast });
      router.refresh();

    } catch (error: any) {
      const message = error.response?.data?.message || "An unexpected error occurred.";
      toast.error(message, { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isClient) return null;

  // Modern Tab Component with Sliding Animation
  const ModernTabs = () => {
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const sliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const activeTabIndex = activeTab === 'attachments' ? 0 : 1;
        const activeTabNode = tabsRef.current[activeTabIndex];
        const sliderNode = sliderRef.current;

        if (activeTabNode && sliderNode) {
            sliderNode.style.left = `${activeTabNode.offsetLeft}px`;
            sliderNode.style.width = `${activeTabNode.offsetWidth}px`;
        }
    }, [activeTab]);

    return (
        <div className="relative flex items-center bg-muted p-1 rounded-lg self-start md:-mt-5">
            <div 
                ref={sliderRef}
                className="absolute top-1 bottom-1 bg-background shadow-sm rounded-md transition-all duration-300 ease-in-out"
            />
            {['attachments', 'invoices'].map((tab, index) => (
                <button
                    key={tab}
                    ref={(el) => { tabsRef.current[index] = el; }}
                    onClick={() => setActiveTab(tab as "attachments" | "invoices")}
                    className={`relative z-10 px-4 py-1.5 text-sm font-semibold transition-colors duration-300 rounded-md focus:outline-none ${
                        activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
  };


  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground">
        <div className="flex items-center border-b border-border px-4 py-2 md:pb-2">
            <ModernTabs />
        </div>

        <div className="flex-grow p-4">
            <div key={activeTab} className="animate-fade-in h-full">
                {activeTab === 'attachments' && (
                    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-12">
                        <div className="md:col-span-4">
                            <AttachmentsList
                                attachments={attachments}
                                selectedAttachment={selectedAttachment}
                                onSelectAttachment={handleSelectAttachment}
                                onFileUpload={handleFileUpload}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                isUploading={isUploading}
                            />
                        </div>
                        <div className="md:col-span-8">
                            {uploadedPdfUrl || selectedAttachment ? (
                                <AttachmentViewer
                                    attachment={selectedAttachment}
                                    pdfUrl={uploadedPdfUrl || selectedAttachment!.s3Url}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                                    <p>Select or upload an attachment to begin.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'invoices' && (
                    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-12">
                        <div className="md:col-span-3">
                           <InvoicesList
                             invoices={invoices}
                             selectedInvoiceId={selectedInvoiceId}
                             onSelectInvoice={handleSelectInvoice}
                           />
                        </div>
                        <div className="md:col-span-5">
                            {invoiceDetails ? (
                                <InvoicePdfViewer
                                    invoicePdfUrl={invoiceDetails.pdfUrl}
                                    sourcePdfUrl={invoiceDetails.sourcePdfUrl}
                                />
                            ) : (
                                 <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                                    <p>Select an invoice to view its PDF.</p>
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
                )}
            </div>
        </div>
        <style jsx global>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in {
                animation: fadeIn 0.4s ease-in-out;
            }
        `}</style>
    </div>
  );
}

