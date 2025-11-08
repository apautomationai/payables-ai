"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { LineItemAutocomplete } from "./line-item-autocomplete-simple";
import { fetchQuickBooksAccounts, fetchQuickBooksItems, updateLineItem } from "@/lib/services/quickbooks.service";
import type { QuickBooksAccount, QuickBooksItem } from "@/lib/services/quickbooks.service";
import type { LineItem } from "@/lib/types/invoice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@workspace/ui/components/dialog";

interface LineItemEditorProps {
  lineItem: LineItem;
  onUpdate?: (updatedLineItem: LineItem) => void;
  isEditing?: boolean;
  isQuickBooksConnected?: boolean | null;
}

export function LineItemEditor({ lineItem, onUpdate, isEditing = false, isQuickBooksConnected = null }: LineItemEditorProps) {
  const router = useRouter();
  const [itemType, setItemType] = useState<'account' | 'product' | null>(lineItem.itemType || null);
  const [accounts, setAccounts] = useState<QuickBooksAccount[]>([]);
  const [items, setItems] = useState<QuickBooksItem[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    lineItem.resourceId ? String(lineItem.resourceId) : null
  );
  const [isQuickBooksErrorOpen, setIsQuickBooksErrorOpen] = useState(false);

  console.log(items)

  console.log("🔧 LineItemEditor mounted with:", {
    itemType: lineItem.itemType,
    resourceId: lineItem.resourceId,
    selectedResourceId,
    isQuickBooksConnected
  });

  // Load accounts when component mounts or when itemType changes to 'account'
  useEffect(() => {
    if (itemType === 'account' && accounts.length === 0 && !isLoadingAccounts) {
      if (isQuickBooksConnected) {
        loadAccounts();
      } else if (isQuickBooksConnected === false) {
        console.log("💰 Skipping accounts load - QuickBooks not connected");
      }
    }
  }, [itemType, accounts.length, isLoadingAccounts, isQuickBooksConnected]);

  // Load items when component mounts or when itemType changes to 'product'
  useEffect(() => {
    if (itemType === 'product' && items.length === 0 && !isLoadingItems) {
      if (isQuickBooksConnected) {
        loadItems();
      } else if (isQuickBooksConnected === false) {
        console.log("🛍️ Skipping products load - QuickBooks not connected");
      }
    }
  }, [itemType, items.length, isLoadingItems, isQuickBooksConnected]);

  // Initial load effect - ensure data is loaded on component mount if itemType is already set
  useEffect(() => {
    console.log("🚀 Initial load effect - itemType:", itemType, "isQuickBooksConnected:", isQuickBooksConnected);
    if (itemType === 'account' && accounts.length === 0 && !isLoadingAccounts) {
      if (isQuickBooksConnected) {
        console.log("🚀 Loading accounts on mount");
        loadAccounts();
      } else if (isQuickBooksConnected === false) {
        console.log("🚀 Skipping accounts load on mount - QuickBooks not connected");
      }
    } else if (itemType === 'product' && items.length === 0 && !isLoadingItems) {
      if (isQuickBooksConnected) {
        console.log("🚀 Loading products on mount");
        loadItems();
      } else if (isQuickBooksConnected === false) {
        console.log("🚀 Skipping products load on mount - QuickBooks not connected");
      }
    }
  }, [isQuickBooksConnected]); // Run when connection status changes

  const loadAccounts = async () => {
    console.log("💰 Loading accounts...");
    setIsLoadingAccounts(true);
    try {
      const fetchedAccounts = await fetchQuickBooksAccounts();
      console.log("💰 Loaded accounts:", fetchedAccounts.length, "accounts");
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error("Error loading accounts:", error);
      toast.error("Failed to load accounts");
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const loadItems = async () => {
    console.log("🛍️ Loading products/services...");
    setIsLoadingItems(true);
    try {
      const fetchedItems = await fetchQuickBooksItems();
      console.log("🛍️ Loaded products/services:", fetchedItems.length, "items");
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error loading items:", error);
      toast.error("Failed to load products/services");
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleItemTypeChange = async (newType: 'account' | 'product' | null) => {
    // Check if QuickBooks is connected before allowing type selection
    if (newType && !isQuickBooksConnected) {
      setIsQuickBooksErrorOpen(true);
      return;
    }

    setItemType(newType);

    // Save the itemType change immediately
    if (isEditing) {
      setIsSaving(true);
      try {
        const updateData: {
          itemType?: 'account' | 'product' | null;
          resourceId?: string | null;
        } = {
          itemType: newType,
          resourceId: null, // Clear resourceId when changing type
        };

        const updatedLineItem = await updateLineItem(lineItem.id, updateData);

        // Update local state
        setSelectedResourceId(null);

        if (onUpdate) {
          onUpdate(updatedLineItem.data);
        }

        toast.success("Line item type updated");
      } catch (error) {
        console.error("Error updating line item type:", error);
        toast.error("Failed to update line item type");
        // Revert on error
        setItemType(lineItem.itemType || null);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAccountSelect = async (accountId: string, _account: QuickBooksAccount) => {
    setSelectedResourceId(accountId);

    if (isEditing) {
      setIsSaving(true);
      try {
        const updateData = {
          itemType: 'account' as const,
          resourceId: accountId, // Keep as string instead of converting to int
        };

        const updatedLineItem = await updateLineItem(lineItem.id, updateData);

        if (onUpdate) {
          onUpdate(updatedLineItem.data);
        }

        toast.success("Account selected");
      } catch (error) {
        console.error("Error updating line item account:", error);
        toast.error("Failed to update account selection");
        setSelectedResourceId(lineItem.resourceId ? String(lineItem.resourceId) : null);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleProductSelect = async (productId: string, _product: QuickBooksItem) => {
    setSelectedResourceId(productId);

    if (isEditing) {
      setIsSaving(true);
      try {
        const updateData = {
          itemType: 'product' as const,
          resourceId: productId, // Keep as string instead of converting to int
        };

        const updatedLineItem = await updateLineItem(lineItem.id, updateData);

        if (onUpdate) {
          onUpdate(updatedLineItem.data);
        }

        toast.success("Product/Service selected");
      } catch (error) {
        console.error("Error updating line item product:", error);
        toast.error("Failed to update product selection");
        setSelectedResourceId(lineItem.resourceId ? String(lineItem.resourceId) : null);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getAccountDisplayName = (account: QuickBooksAccount) => {
    return account.FullyQualifiedName || account.Name;
  };

  const getItemDisplayName = (item: QuickBooksItem) => {
    return item.FullyQualifiedName || item.Name;
  };

  return (
    <div className={cn(
      "bg-muted/50 rounded-lg p-3 text-sm space-y-3",
      isEditing && "border-2 border-primary"
    )}>
      {/* Line Item Info */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <span className="font-medium text-foreground">
            {lineItem.item_name || `Item ${lineItem.id}`}
          </span>
          {lineItem.description && (
            <p className="text-muted-foreground text-xs mt-1">
              {lineItem.description}
            </p>
          )}
        </div>
        <span className="text-muted-foreground ml-2">
          ${parseFloat(lineItem.amount || "0").toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mb-3">
        <span>Qty: {lineItem.quantity || 1}</span>
        <span>Rate: ${parseFloat(lineItem.rate || "0").toFixed(2)}</span>
      </div>

      {/* Item Type Selector */}
      <div className="space-y-2">
        <Label htmlFor={`item-type-${lineItem.id}`} className="text-xs">
          Item Type
        </Label>
        {isQuickBooksConnected === false ? (
          <div
            className="h-9 px-3 py-2 border border-input bg-background rounded-md text-sm text-muted-foreground cursor-pointer hover:bg-accent flex items-center"
            onClick={() => setIsQuickBooksErrorOpen(true)}
          >
            Connect QuickBooks to categorize items
          </div>
        ) : isQuickBooksConnected === null ? (
          <div className="h-9 px-3 py-2 border border-input bg-background rounded-md text-sm text-muted-foreground flex items-center">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Checking connection...
          </div>
        ) : (
          <Select
            value={itemType || undefined}
            onValueChange={(value) => handleItemTypeChange(value as 'account' | 'product' | null)}
            disabled={!isEditing || isSaving || isQuickBooksConnected === null}
          >
            <SelectTrigger id={`item-type-${lineItem.id}`} className="h-9">
              <SelectValue placeholder={isQuickBooksConnected === null ? "Checking connection..." : "Select type..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="account">Account</SelectItem>
              <SelectItem value="product">Product/Service</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Autocomplete Field */}
      {itemType && (
        <div className="space-y-2">
          <Label htmlFor={`autocomplete-${lineItem.id}`} className="text-xs">
            {itemType === 'account' ? 'Account' : 'Product/Service'}
          </Label>
          {itemType === 'account' ? (
            <LineItemAutocomplete
              items={accounts}
              value={selectedResourceId}
              onSelect={handleAccountSelect}
              placeholder="Search accounts..."
              isLoading={isLoadingAccounts}
              disabled={!isEditing || isSaving}
              getDisplayName={getAccountDisplayName}
            />
          ) : (
            <LineItemAutocomplete
              items={items}
              value={selectedResourceId}
              onSelect={handleProductSelect}
              placeholder="Search products/services..."
              isLoading={isLoadingItems}
              disabled={!isEditing || isSaving}
              getDisplayName={getItemDisplayName}
            />
          )}
        </div>
      )}

      {isSaving && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </div>
      )}

      {/* QuickBooks Integration Error Dialog (same as in confirmation modals) */}
      <Dialog open={isQuickBooksErrorOpen} onOpenChange={setIsQuickBooksErrorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QuickBooks Integration Required</DialogTitle>
            <DialogDescription>
              To categorize line items with accounts and products/services, you need to connect your QuickBooks account first.
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
                      Please connect your QuickBooks account in the integrations page to enable line item categorization.
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

