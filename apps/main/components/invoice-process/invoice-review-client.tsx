"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/lib/axios-client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import AttachmentsList from "./attachments-list";
import AttachmentViewer from "./attachment-viewer";
import InvoiceDetailsForm from "./invoice-details-form";
import InvoicesList from "./invoices-list";
import InvoicePdfViewer from "./invoice-pdf-viewer";
import type { Attachment, InvoiceDetails, InvoiceListItem, InvoiceStatus } from "@/lib/types/invoice";

// API Response type for single invoice/attachment actions
interface InvoiceApiResponse {
  success: boolean;
  data: InvoiceDetails;
}

interface AttachmentApiResponse {
  success: boolean;
  data: Attachment;
}

export default function InvoiceReviewClient({
  attachments,
  initialInvoiceDetails,
  currentPage,
  totalPages,
  invoices,
  invoiceCurrentPage,
  invoiceTotalPages,
  initialSelectedInvoice,
  initialInvoiceCache,
}: {
  attachments: Attachment[];
  initialInvoiceDetails: InvoiceDetails | null;
  currentPage: number;
  totalPages: number;
  invoices: InvoiceListItem[];
  invoiceCurrentPage: number;
  invoiceTotalPages: number;
  initialSelectedInvoice: InvoiceListItem | null | undefined;
  initialInvoiceCache: Record<number, InvoiceDetails>;
}) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"attachments" | "invoices">("invoices");
  
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<string | null>(
    attachments.length > 0 ? attachments[0]!.id : null
  );
  const [isUploading, setIsUploading] = useState(false);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(initialSelectedInvoice?.id || null);
  
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(initialInvoiceDetails);
  const [originalInvoiceDetails, setOriginalInvoiceDetails] = useState<InvoiceDetails | null>(initialInvoiceDetails);
  
  const [invoiceDetailsCache, setInvoiceDetailsCache] = useState<Record<number, InvoiceDetails>>(initialInvoiceCache);

  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (invoiceDetails) {
      setSelectedFields(Object.keys(invoiceDetails));
    }
  }, [invoiceDetails]);
  
  const selectedAttachment = useMemo(
    () => attachments.find((att) => att.id === selectedAttachmentId) || null,
    [attachments, selectedAttachmentId]
  );
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleSelectAttachment = (attachment: Attachment) => {
    setSelectedAttachmentId(attachment.id);
  };
  
  const handleSelectInvoice = async (invoice: InvoiceListItem) => {
    if (invoice.id === selectedInvoiceId) return;
    
    setIsEditing(false);
    setSelectedInvoiceId(invoice.id);

    if (invoiceDetailsCache[invoice.id]) {
      //@ts-ignore
      const cachedDetails = invoiceDetailsCache[invoice.id];
      //@ts-ignore
      setInvoiceDetails(cachedDetails);
      //@ts-ignore
      setOriginalInvoiceDetails(cachedDetails);
      return;
    }

    setIsDetailsLoading(true);
    try {
      const response = await client.get<InvoiceApiResponse>(`/api/v1/invoice/invoices/${invoice.id}`);
      const newDetails = response.data;
      //@ts-ignore
      setInvoiceDetails(newDetails);
      //@ts-ignore
      setOriginalInvoiceDetails(newDetails);
//@ts-ignore
      setInvoiceDetailsCache(prevCache => ({
        ...prevCache,
        [invoice.id]: newDetails,
      }));

    } catch (error: any) {
      let errorMessage = "Could not load invoice details.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsDetailsLoading(false);
    }
  };
  
  const handleInvoicePageChange = (page: number) => {
    router.push(`/invoice-review?page=${page}`);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!invoiceDetails) return;
    const { name, value } = e.target;
    setInvoiceDetails((prev) => (prev ? { ...prev, [name]: value } : null));
  };
  
  const handleCancelEdit = () => {
    setInvoiceDetails(originalInvoiceDetails);
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    if (!invoiceDetails) return;
    try {
      const response = await client.patch<InvoiceApiResponse>(
        `/api/v1/invoice/invoices/${invoiceDetails.id}`,
        invoiceDetails
      );
      const updatedData = response.data;
      //@ts-ignore
      setInvoiceDetails(updatedData);
      //@ts-ignore
      setOriginalInvoiceDetails(updatedData);
      //@ts-ignore
      setInvoiceDetailsCache(prevCache => ({ ...prevCache, [updatedData.id]: updatedData }));
      toast.success("Changes saved successfully");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      toast.error("Failed to save changes");
      throw err;
    }
  };

  const handleApproveInvoice = async () => {
    if (!invoiceDetails) return;
    try {
      const response = await client.patch<InvoiceApiResponse>(
        `/api/v1/invoice/invoices/${invoiceDetails.id}`,
        { status: "approved" }
      );
      const updatedData = response.data;
      //@ts-ignore
      setInvoiceDetails(updatedData);
      //@ts-ignore
      setOriginalInvoiceDetails(updatedData);
      //@ts-ignore
      setInvoiceDetailsCache(prevCache => ({ ...prevCache, [updatedData.id]: updatedData }));
      toast.success("Invoice has been approved");
      router.refresh();
    } catch (err) {
      toast.error("Failed to approve invoice");
      throw err;
    }
  };

  const handleRejectInvoice = async () => {
    if (!invoiceDetails) return;
    try {
      const response = await client.patch<InvoiceApiResponse>(
        `/api/v1/invoice/invoices/${invoiceDetails.id}`,
        { status: "rejected" }
      );
      const updatedData = response.data;
      //@ts-ignore
      setInvoiceDetails(updatedData);
      //@ts-ignore
      setOriginalInvoiceDetails(updatedData);
      //@ts-ignore
      setInvoiceDetailsCache(prevCache => ({ ...prevCache, [updatedData.id]: updatedData }));
      toast.success("Invoice has been rejected");
      router.refresh();
    } catch (err) {
      toast.error("Failed to reject invoice");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Invalid file type. Only PDF files are accepted.");
      return;
    }

    setSelectedAttachmentId(null);
    setIsUploading(true);
    const uploadToast = toast.loading("Preparing to upload...");

    try {
      const response = await client.get<{ 
        signedUrl: string; 
        publicUrl: string;
        key: string;
      }>(
        `/api/v1/upload/upload-attachment`,
        { params: { filename: file.name, mimetype: file.type } }
      );
      //@ts-ignore
      const { signedUrl, publicUrl, key } = response;
      
      if (!signedUrl || !publicUrl || !key) {
        throw new Error("Failed to retrieve valid upload details from the server.");
      }
      
      const uploadResponse = await axios.put(signedUrl, file, {
        headers: { "Content-Type": file.type },
        timeout: 60000,
      });

      if (uploadResponse.status !== 200) {
        throw new Error("File upload to storage failed.");
      }

      const createRecordResponse = await client.post<AttachmentApiResponse>("/api/v1/upload/create-record", {
        filename: file.name,
        mimetype: file.type,
        s3Url: publicUrl,
      });

      const newAttachment = createRecordResponse.data;

      toast.success("PDF uploaded and processed successfully!", { id: uploadToast });
      //@ts-ignore
      setSelectedAttachmentId(newAttachment.id);
      
      router.refresh();

    } catch (error: any) {
      let errorMessage = "An unexpected error occurred during upload.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isClient) return null;
  
  const ModernTabs = () => {
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const sliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const activeTabIndex = activeTab === 'invoices' ? 0 : 1;
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
            {['invoices', 'attachments'].map((tab, index) => (
                <button
                    key={tab}
                    ref={(el) => { tabsRef.current[index] = el; }}
                    onClick={() => setActiveTab(tab as "invoices" | "attachments")}
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

      <div className="flex-grow p-4 min-h-0">
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
                  {selectedAttachment ? (
                      <AttachmentViewer
                          attachment={selectedAttachment}
                          pdfUrl={selectedAttachment.s3Url}
                      />
                  ) : (
                      <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                          <p>Select or upload a PDF attachment to begin.</p>
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
                   currentPage={invoiceCurrentPage}
                   totalPages={invoiceTotalPages}
                   onPageChange={handleInvoicePageChange}
                 />
              </div>
              
              {invoiceDetails ? (
                <>
                  <div className={`md:col-span-5 transition-opacity duration-300 ${isDetailsLoading ? 'opacity-50' : 'opacity-100'}`}>
                    <InvoicePdfViewer
                      invoiceUrl={invoiceDetails.invoiceUrl}
                      sourcePdfUrl={invoiceDetails.sourcePdfUrl}
                    />
                  </div>

                  <div className={`md:col-span-4 relative transition-opacity duration-300 ${isDetailsLoading ? 'opacity-50' : 'opacity-100'}`}>
                    {isDetailsLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                    <InvoiceDetailsForm
                      invoiceDetails={invoiceDetails}
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                      onDetailsChange={handleDetailsChange}
                      selectedFields={selectedFields}
                      setSelectedFields={setSelectedFields}
                      onSave={handleSaveChanges}
                      onReject={handleRejectInvoice}
                      onApprove={handleApproveInvoice}
                      onCancel={handleCancelEdit}
                    />
                  </div>
                </>
              ) : (
                <div className="md:col-span-9 flex items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                  <p>Select an invoice to view its details.</p>
                </div>
              )}
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