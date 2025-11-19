"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, MoreVertical, Trash2, Copy } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCloning, setIsCloning] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showCloneDialog, setShowCloneDialog] = useState(false);

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

            // Update the invoice in the list
            setInvoicesList(prev => prev.map(inv =>
                inv.id === invoiceDetails.id ? { ...inv, status: updatedData.status } : inv
            ));

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

            // Update the invoice in the list
            setInvoicesList(prev => prev.map(inv =>
                inv.id === invoiceDetails.id ? { ...inv, status: "approved" } : inv
            ));

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

            // Update the invoice in the list
            setInvoicesList(prev => prev.map(inv =>
                inv.id === invoiceDetails.id ? { ...inv, status: "rejected" } : inv
            ));

            toast.success("Invoice has been rejected");
        } catch (err) {
            toast.error("Failed to reject invoice");
        }
    };

    const handleCancelEdit = () => {
        setInvoiceDetails(originalInvoiceDetails);
        setIsEditing(false);
    };

    const handleDeleteInvoice = async () => {
        if (!invoiceDetails) return;

        setIsDeleting(true);
        try {
            await client.delete(`/api/v1/invoice/invoices/${invoiceDetails.id}`);
            toast.success("Invoice page deleted successfully");

            // Remove from local list
            const updatedList = invoicesList.filter((_, index) => index !== currentInvoiceIndex);
            setInvoicesList(updatedList);

            if (updatedList.length === 0) {
                // No more invoices, go back to jobs list
                router.push("/jobs");
            } else {
                // Move to next invoice or previous if we deleted the last one
                const newIndex = currentInvoiceIndex >= updatedList.length
                    ? updatedList.length - 1
                    : currentInvoiceIndex;
                setCurrentInvoiceIndex(newIndex);
                const nextInvoice = updatedList[newIndex];
                if (nextInvoice) {
                    await fetchInvoiceDetails(nextInvoice.id);
                }
            }

            setShowDeleteDialog(false);
        } catch (error) {
            console.error("Failed to delete invoice:", error);
            toast.error("Failed to delete invoice page");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloneInvoice = async () => {
        if (!invoiceDetails) return;

        setIsCloning(true);
        try {
            const response: any = await client.post(`/api/v1/invoice/invoices/${invoiceDetails.id}/clone`);

            if (response.success) {
                toast.success("Invoice page cloned successfully");

                // Refresh the invoices list
                const refreshResponse = await client.get(`/api/v1/invoice/invoices?attachmentId=${jobId}`);
                const invoiceData = refreshResponse.data?.data?.invoices || refreshResponse.data?.invoices || [];
                setInvoicesList(invoiceData);

                // Find and select the new cloned invoice
                const clonedInvoice = invoiceData.find((inv: InvoiceListItem) =>
                    inv.invoiceNumber === response.data?.invoiceNumber ||
                    inv.id === response.data?.id
                );

                if (clonedInvoice) {
                    const clonedIndex = invoiceData.findIndex((inv: InvoiceListItem) => inv.id === clonedInvoice.id);
                    setCurrentInvoiceIndex(clonedIndex);
                    await fetchInvoiceDetails(clonedInvoice.id);
                }
            }

            setShowCloneDialog(false);
        } catch (error) {
            console.error("Failed to clone invoice:", error);
            toast.error("Failed to clone invoice page");
        } finally {
            setIsCloning(false);
        }
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="space-y-4 h-full">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 bg-muted/30 rounded-lg px-4 py-3 border">
                <Button variant="secondary" size="icon" onClick={handleBack} className="h-9 w-9">
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                {/* Status Counts */}
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium text-sm px-3 py-1">
                        Approved: {invoicesList.filter(inv => inv.status === "approved").length}
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium text-sm px-3 py-1">
                        Rejected: {invoicesList.filter(inv => inv.status === "rejected").length}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-medium text-sm px-3 py-1">
                        Pending: {invoicesList.filter(inv => inv.status === "pending").length}
                    </Badge>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-4 h-[calc(100%-4rem)] ">
                {/* Left Side - Invoice Preview with Carousel */}
                <div className="flex flex-col h-full gap-4 min-w-0 overflow-hidden">
                    {/* Carousel Controls with Current Invoice Status and Actions */}
                    <div className="flex items-center justify-between gap-4 bg-card rounded-lg border px-4 py-3">
                        {/* Left: Navigation */}
                        {invoicesList.length > 1 ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePreviousInvoice}
                                    disabled={currentInvoiceIndex === 0}
                                    className="h-9 w-9 bg-primary/10 hover:bg-primary/20"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <span className="text-sm font-semibold px-3">
                                    Invoice {currentInvoiceIndex + 1} of {invoicesList.length}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNextInvoice}
                                    disabled={currentInvoiceIndex === invoicesList.length - 1}
                                    className="h-9 w-9 bg-primary/10 hover:bg-primary/20"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="text-sm font-semibold">Invoice Information</div>
                        )}

                        {/* Right: Current Invoice Status and Actions */}
                        <div className="flex items-center gap-3">
                            {invoiceDetails && invoiceDetails.status && (
                                <Badge variant="outline" className={getStatusColor(invoiceDetails.status)}>
                                    {invoiceDetails.status.charAt(0).toUpperCase() + invoiceDetails.status.slice(1)}
                                </Badge>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9">
                                        <MoreVertical className="h-4 w-4 mr-2" />
                                        Actions
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setShowCloneDialog(true)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Clone Page
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => setShowDeleteDialog(true)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Job
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* PDF Preview */}
                    <div className="flex-1 min-h-0 overflow-hidden">
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
                <div className="flex flex-col h-full min-w-0 overflow-hidden">
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Invoice Page</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this invoice page? This action cannot be undone.
                            {invoiceDetails && (
                                <div className="mt-2 text-sm">
                                    <strong>Invoice:</strong> {invoiceDetails.invoiceNumber || "N/A"}
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteInvoice}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Clone Confirmation Dialog */}
            <AlertDialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clone Invoice Page</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to clone this invoice page? This will create a duplicate with all line items.
                            {invoiceDetails && (
                                <div className="mt-2 text-sm">
                                    <strong>Invoice:</strong> {invoiceDetails.invoiceNumber || "N/A"}
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCloning}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCloneInvoice}
                            disabled={isCloning}
                        >
                            {isCloning ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Cloning...
                                </>
                            ) : (
                                "Clone"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
