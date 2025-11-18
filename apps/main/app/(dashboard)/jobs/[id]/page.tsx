"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { client } from "@/lib/axios-client";
import { toast } from "sonner";
import InvoicePdfViewer from "@/components/invoice-process/invoice-pdf-viewer";
import InvoiceDetailsForm from "@/components/invoice-process/invoice-details-form";
import type { InvoiceDetails, InvoiceListItem } from "@/lib/types/invoice";

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const [invoicesList, setInvoicesList] = useState<InvoiceListItem[]>([]);
    const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(0);
    const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
    const [originalInvoiceDetails, setOriginalInvoiceDetails] = useState<InvoiceDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    const lineItemChangesRef = useRef<{
        saveLineItemChanges: () => Promise<void>;
        hasChanges: () => boolean;
    } | null>(null);

    const currentInvoiceId = invoicesList[currentInvoiceIndex]?.id;

    // Fetch invoice list for this job
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setIsLoading(true);
                const response = await client.get(`/api/v1/invoice/invoices?attachmentId=${jobId}`);
                const invoiceData = response.data?.data?.invoices || response.data?.invoices || [];
                setInvoicesList(invoiceData);

                // Load details for first invoice
                if (invoiceData.length > 0) {
                    await fetchInvoiceDetails(invoiceData[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch invoices:", error);
                toast.error("Failed to load invoices");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoices();
    }, [jobId]);

    // Fetch full invoice details
    const fetchInvoiceDetails = async (invoiceId: number) => {
        try {
            setIsDetailsLoading(true);
            const response = await client.get<InvoiceDetails>(`/api/v1/invoice/invoices/${invoiceId}`);
            const details = response.data;
            setInvoiceDetails(details);
            setOriginalInvoiceDetails(details);
            setSelectedFields(Object.keys(details));
        } catch (error) {
            console.error("Failed to fetch invoice details:", error);
            toast.error("Failed to load invoice details");
        } finally {
            setIsDetailsLoading(false);
        }
    };

    // Update details when invoice changes
    useEffect(() => {
        if (currentInvoiceId) {
            fetchInvoiceDetails(currentInvoiceId);
        }
    }, [currentInvoiceId]);

    const handleBack = () => {
        router.push("/jobs");
    };

    const handlePreviousInvoice = () => {
        if (currentInvoiceIndex > 0) {
            setCurrentInvoiceIndex(currentInvoiceIndex - 1);
        }
    };

    const handleNextInvoice = () => {
        if (currentInvoiceIndex < invoicesList.length - 1) {
            setCurrentInvoiceIndex(currentInvoiceIndex + 1);
        }
    };

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!invoiceDetails) return;
        const { name, value } = e.target;
        setInvoiceDetails((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSaveChanges = async () => {
        if (!invoiceDetails) return;
        try {
            const dataToSave = {
                ...invoiceDetails,
                ...(invoiceDetails.status === "approved" || invoiceDetails.status === "rejected"
                    ? { status: "pending" }
                    : {}),
            };

            const response = await client.patch(`/api/v1/invoice/${invoiceDetails.id}`, dataToSave);
            const updatedData = response?.data;

            // Save line item changes if any
            if (lineItemChangesRef.current && lineItemChangesRef.current.hasChanges()) {
                await lineItemChangesRef.current.saveLineItemChanges();
                toast.success("Invoice and line items saved successfully");
            } else {
                toast.success("Invoice saved successfully");
            }

            setInvoiceDetails(updatedData);
            setOriginalInvoiceDetails(updatedData);
            setIsEditing(false);
        } catch (err) {
            toast.error("Failed to save changes");
        }
    };

    const handleApprove = async () => {
        if (!invoiceDetails) return;
        try {
            const response = await client.patch<{ data: InvoiceDetails }>(
                `/api/v1/invoice/invoices/${invoiceDetails.id}`,
                { status: "approved" }
            );
            const updatedData = response.data.data;
            setInvoiceDetails(updatedData);
            setOriginalInvoiceDetails(updatedData);
            toast.success("Invoice has been approved");
        } catch (err) {
            toast.error("Failed to approve invoice");
        }
    };

    const handleReject = async () => {
        if (!invoiceDetails) return;
        try {
            const response = await client.patch<{ data: InvoiceDetails }>(
                `/api/v1/invoice/invoices/${invoiceDetails.id}`,
                { status: "rejected" }
            );
            const updatedData = response.data.data;
            setInvoiceDetails(updatedData);
            setOriginalInvoiceDetails(updatedData);
            toast.success("Invoice has been rejected");
        } catch (err) {
            toast.error("Failed to reject invoice");
        }
    };

    const handleCancelEdit = () => {
        setInvoiceDetails(originalInvoiceDetails);
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (invoicesList.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Job Details</h1>
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-8 text-center">
                    <p className="text-muted-foreground">No invoices found for this job</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Invoice Review - Job #{jobId}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Invoice {currentInvoiceIndex + 1} of {invoicesList.length}
                    </p>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-5rem)]">
                {/* Left Side - Invoice Preview with Carousel */}
                <div className="flex flex-col h-full gap-4">
                    {/* Carousel Controls */}
                    {invoicesList.length > 1 && (
                        <div className="flex items-center justify-center gap-2 bg-card rounded-lg border px-4 py-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePreviousInvoice}
                                disabled={currentInvoiceIndex === 0}
                                className="h-8 w-8"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium px-2">
                                Invoice {currentInvoiceIndex + 1} of {invoicesList.length}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNextInvoice}
                                disabled={currentInvoiceIndex === invoicesList.length - 1}
                                className="h-8 w-8"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* PDF Preview */}
                    <div className="flex-1">
                        {invoiceDetails ? (
                            <InvoicePdfViewer
                                fileUrl={invoiceDetails.fileUrl}
                                sourcePdfUrl={invoiceDetails.sourcePdfUrl}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full rounded-lg border bg-card">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Invoice Details Form */}
                <div className="flex flex-col h-full">
                    {invoiceDetails && originalInvoiceDetails ? (
                        <InvoiceDetailsForm
                            invoiceDetails={invoiceDetails}
                            originalInvoiceDetails={originalInvoiceDetails}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            onDetailsChange={handleDetailsChange}
                            selectedFields={selectedFields}
                            setSelectedFields={setSelectedFields}
                            onSave={handleSaveChanges}
                            onReject={handleReject}
                            onApprove={handleApprove}
                            onCancel={handleCancelEdit}
                            onFieldChange={() => { }}
                            lineItemChangesRef={lineItemChangesRef}
                            onApprovalSuccess={() => {
                                router.push("/jobs");
                            }}
                            onInvoiceDetailsUpdate={(updatedDetails) => {
                                setInvoiceDetails(updatedDetails);
                                setOriginalInvoiceDetails(updatedDetails);
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full rounded-lg border bg-card">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
