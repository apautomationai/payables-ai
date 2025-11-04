"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { client } from "@/lib/axios-client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@workspace/ui/components/dialog";
import { InvoiceDetails } from "@/lib/types/invoice";
import { formatLabel, renderValue, formatDate } from "@/lib/utility/formatters";

// Helper function to capitalize status
const capitalizeStatus = (status: string | null | undefined): string => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

interface ConfirmationModalsProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  invoiceDetails: InvoiceDetails;
  selectedFields: string[];
  onSave: () => Promise<void>;
  onReject: () => Promise<void>;
  onApprove: () => Promise<void>;
  onCancel: () => void;
  onApprovalSuccess?: () => void;
  onInvoiceDetailsUpdate?: (updatedDetails: InvoiceDetails) => void;
}

export default function ConfirmationModals({
  isEditing,
  setIsEditing,
  invoiceDetails,
  selectedFields,
  onSave,
  onReject,
  onApprove,
  onCancel,
  onApprovalSuccess,
  onInvoiceDetailsUpdate,
}: ConfirmationModalsProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isQuickBooksErrorOpen, setIsQuickBooksErrorOpen] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  const checkQuickBooksIntegration = async (): Promise<boolean> => {
    try {
      const response: any = await client.get('/api/v1/quickbooks/status');
      return response?.data?.connected === true;
    } catch (error) {
      console.error('Error checking QuickBooks integration:', error);
      return false;
    }
  };

  const handleApproveClick = async () => {
    const isConnected = await checkQuickBooksIntegration();
    if (!isConnected) {
      setIsQuickBooksErrorOpen(true);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirmApproval = async () => {
    setIsApproving(true);

    try {
      // Step 1: Get line items from database using invoice ID
      const invoiceId = invoiceDetails.id;
      if (!invoiceId) {
        throw new Error("Invoice ID not found");
      }

      const dbLineItemsResponse: any = await client.get(`/api/v1/invoice/line-items/invoice/${invoiceId}`);

      if (dbLineItemsResponse.success && dbLineItemsResponse.data.length > 0) {
        const processedItems = [];

        // Step 2: Process each line item individually
        for (const lineItem of dbLineItemsResponse.data) {
          const itemName = lineItem.item_name;

          // Search for this specific item in QuickBooks
          const searchResponse: any = await client.get("/api/v1/quickbooks/search-items", {
            params: { searchTerm: itemName }
          });

          let qbItem = null;
          if (searchResponse.success && searchResponse.data.results.length > 0) {
            // Item found in QuickBooks
            qbItem = searchResponse.data.results[0];
          } else {
            // Item not found, create new one
            const createItemResponse: any = await client.post("/api/v1/quickbooks/create-item", {
              name: itemName,
              description: lineItem.description || `${itemName} service item`,
              type: "Service",
              lineItemData: {
                quantity: lineItem.quantity,
                rate: lineItem.rate,
                amount: lineItem.amount,
                description: lineItem.description
              }
            });
            qbItem = createItemResponse.data;
          }

          processedItems.push({
            dbLineItem: lineItem,
            qbItem: qbItem
          });
        }

        // Step 3: Search for customer and create if needed
        const customerName = invoiceDetails.customerName;
        let customer = null;

        if (customerName) {
          const customerSearchResponse: any = await client.get("/api/v1/quickbooks/search-customers", {
            params: { searchTerm: customerName }
          });

          if (customerSearchResponse.success && customerSearchResponse.data.results.length > 0) {
            // Found customer with 95%+ match
            customer = customerSearchResponse.data.results[0];
          } else {
            // No customer found with 95%+ match, create new customer
            const createCustomerResponse: any = await client.post("/api/v1/quickbooks/create-customer", {
              name: customerName
            });
            // Handle create customer response format: data.Customer
            customer = createCustomerResponse.data?.Customer || createCustomerResponse.data;
          }
        }

        // Step 4: Hierarchical vendor search (email → phone → address → name)
        const vendorSearchResponse: any = await client.get("/api/v1/quickbooks/hierarchical-vendor-search", {
          params: {
            email: invoiceDetails.vendorEmail,
            phone: invoiceDetails.vendorPhone,
            address: invoiceDetails.vendorAddress,
            name: invoiceDetails.vendorName
          }
        });

        let vendor = null;
        if (vendorSearchResponse.success && vendorSearchResponse.data.found) {
          // Found vendor using hierarchical search
          vendor = vendorSearchResponse.data.vendor;
          console.log(`Vendor found by ${vendorSearchResponse.data.matchType}:`, vendor.DisplayName || vendor.Name);
        } else {
          // No vendor found, create new vendor with all available information
          const vendorName = invoiceDetails.vendorName;
          if (vendorName) {
            const createVendorResponse: any = await client.post("/api/v1/quickbooks/create-vendor", {
              name: vendorName,
              email: invoiceDetails.vendorEmail,
              phone: invoiceDetails.vendorPhone,
              address: invoiceDetails.vendorAddress
            });
            // Handle create vendor response format: data.Vendor
            vendor = createVendorResponse.data?.Vendor || createVendorResponse.data;
            console.log("Created new vendor with full details:", vendor.DisplayName || vendor.Name);
          } else {
            throw new Error("No vendor information available to create vendor");
          }
        }

        if (!vendor) {
          throw new Error("Failed to find or create vendor in QuickBooks");
        }

        // Step 5: Create bill in QuickBooks using processed line items
        const billLineItems = processedItems.map((item: any) => ({
          amount: parseFloat(item.dbLineItem.amount) || 0,
          description: item.dbLineItem.description || item.dbLineItem.item_name,
          itemId: item.qbItem?.Id || item.qbItem?.QueryResponse?.Item?.[0]?.Id
        }));

        // Calculate discount by comparing popup total with line items sum
        const totalAmountFromPopup = parseFloat(invoiceDetails?.totalAmount ?? "0") || 0;
        const lineItemsSum = billLineItems.reduce((sum, item) => sum + item.amount, 0);
        const discountAmount = lineItemsSum - totalAmountFromPopup;

        // Extract vendor ID (handle both search and create response formats)
        const vendorId = vendor.Id || vendor.id;

        // Extract tax amount if available
        const totalTaxAmount = parseFloat(invoiceDetails?.totalTax ?? "0") || 0;

        await client.post("/api/v1/quickbooks/create-bill", {
          vendorId: vendorId,
          lineItems: billLineItems,
          totalAmount: totalAmountFromPopup,
          ...(totalTaxAmount > 0 && { totalTax: totalTaxAmount }),
          dueDate: invoiceDetails.dueDate,
          invoiceDate: invoiceDetails.invoiceDate,
          // Add discount if there's a positive difference (line items > total)
          ...(discountAmount > 0 && {
            discountAmount: discountAmount,
            discountDescription: "Invoice Discount"
          })
        });

        // Step 6: Update invoice status to approved
        const statusUpdateResponse: any = await client.patch(`/api/v1/invoice/${invoiceId}/status`, {
          status: "approved"
        });

        // Update local invoice details state
        if (onInvoiceDetailsUpdate && statusUpdateResponse.success) {
          const updatedDetails = { ...invoiceDetails, status: "approved" };
          onInvoiceDetailsUpdate(updatedDetails as InvoiceDetails);
        }

        toast.success("Invoice approved and bill created in QuickBooks successfully!");

        // Close the dialog first
        setIsDialogOpen(false);

        // Call success callback to close popup and refetch
        if (onApprovalSuccess) {
          onApprovalSuccess();
        }
      } else {
        throw new Error("No line items found for this invoice");
      }
    } catch (error: any) {
      console.error("Error in approval process:", error.response?.data || error.message);

      // Show error toast with specific message
      const errorMessage = error.response?.data?.error || error.message || "Failed to process invoice approval";
      toast.error("Approval Failed", {
        description: errorMessage
      });
    }

    setIsApproving(false);
  };

  const handleConfirmReject = async () => {
    setIsRejecting(true);

    try {
      const invoiceId = invoiceDetails.id;

      // Update invoice status to rejected
      const statusUpdateResponse: any = await client.patch(`/api/v1/invoice/${invoiceId}/status`, {
        status: "rejected"
      });

      // Update local invoice details state
      if (onInvoiceDetailsUpdate && statusUpdateResponse.success) {
        const updatedDetails = { ...invoiceDetails, status: "rejected" };
        onInvoiceDetailsUpdate(updatedDetails as InvoiceDetails);
      }

      toast.success("Invoice has been rejected");

      // Close the dialog first
      setIsRejectDialogOpen(false);

    } catch (error: any) {
      console.error("Error rejecting invoice:", error.response?.data || error.message);

      const errorMessage = error.response?.data?.error || error.message || "Failed to reject invoice";
      toast.error("Rejection Failed", {
        description: errorMessage
      });
    }

    setIsRejecting(false);
  };

  // Check if invoice is already approved or rejected
  const isInvoiceFinalized = invoiceDetails.status === "approved" || invoiceDetails.status === "rejected";

  return (
    <div className="flex justify-between mt-4">
      {isEditing ? (
        <>
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          {!isInvoiceFinalized && (
            <div className="flex gap-2">
              <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
                    disabled={isRejecting}
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Invoice Rejection</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reject this invoice? This action will mark the invoice as rejected.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleConfirmReject}
                      disabled={isRejecting}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleApproveClick}
                variant="default"
              >
                Approve
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Invoice Approval</DialogTitle>
                    <DialogDescription>
                      The following selected fields are present. Approving will update the invoice status.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-60 overflow-y-auto my-4 pr-2">
                    <div className="grid gap-2 text-sm">
                      {selectedFields
                        .filter((key) => {
                          // Hide internal/system fields from the approval popup
                          const hiddenFields = [
                            'id',
                            'userId',
                            'attachmentId',
                            'fileUrl',
                            'fileKey',
                            's3JsonKey',
                            'createdAt',
                            'updatedAt',
                            'sourcePdfUrl'
                          ];
                          return !hiddenFields.includes(key);
                        })
                        .map((key) => (
                          <div
                            key={key}
                            className="grid grid-cols-2 gap-4 items-center"
                          >
                            <span className="text-muted-foreground">
                              {formatLabel(key)}
                            </span>
                            <span className="font-semibold text-right truncate">
                              {key === 'status'
                                ? capitalizeStatus(invoiceDetails[key as keyof InvoiceDetails] as string)
                                : (key === 'invoiceDate' || key === 'dueDate')
                                  ? formatDate(invoiceDetails[key as keyof InvoiceDetails] as string)
                                  : renderValue(invoiceDetails[key as keyof InvoiceDetails])
                              }
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleConfirmApproval}
                      disabled={isApproving}
                    >
                      {isApproving ? "Confirming..." : "Confirm Approval"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          {isInvoiceFinalized && (
            <div className="flex items-center justify-end">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${invoiceDetails.status === "approved"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}>
                {invoiceDetails.status === "approved" ? "✓ Approved" : invoiceDetails.status === "rejected" ? "✗ Rejected" : `✓ ${capitalizeStatus(invoiceDetails.status)}`}
              </div>
            </div>
          )}
        </>
      )}

      {/* QuickBooks Integration Error Dialog */}
      <Dialog open={isQuickBooksErrorOpen} onOpenChange={setIsQuickBooksErrorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QuickBooks Integration Required</DialogTitle>
            <DialogDescription>
              To approve invoices and create bills in QuickBooks, you need to connect your QuickBooks account first.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Integration Not Connected
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Please connect your QuickBooks account in the integrations page to enable invoice approval and bill creation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setIsQuickBooksErrorOpen(false);
                router.push('/integrations');
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Go to Integrations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}