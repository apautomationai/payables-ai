"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { LineItemAutocomplete } from "./line-item-autocomplete";
import { fetchQuickBooksAccounts, fetchQuickBooksItems, updateLineItem } from "@/lib/services/quickbooks.service";
import type { QuickBooksAccount, QuickBooksItem } from "@/lib/services/quickbooks.service";
import type { LineItem } from "@/lib/types/invoice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface LineItemEditorProps {
  lineItem: LineItem;
  onUpdate?: (updatedLineItem: LineItem) => void;
  isEditing?: boolean;
}

export function LineItemEditor({ lineItem, onUpdate, isEditing = false }: LineItemEditorProps) {
  const [itemType, setItemType] = useState<'account' | 'product' | null>(lineItem.itemType || null);
  const [accounts, setAccounts] = useState<QuickBooksAccount[]>([]);
  const [items, setItems] = useState<QuickBooksItem[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    lineItem.resourceId ? String(lineItem.resourceId) : null
  );

  // Load accounts when component mounts or when itemType changes to 'account'
  useEffect(() => {
    if (itemType === 'account' && accounts.length === 0 && !isLoadingAccounts) {
      loadAccounts();
    }
  }, [itemType]);

  // Load items when component mounts or when itemType changes to 'product'
  useEffect(() => {
    if (itemType === 'product' && items.length === 0 && !isLoadingItems) {
      loadItems();
    }
  }, [itemType]);

  const loadAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const fetchedAccounts = await fetchQuickBooksAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error("Error loading accounts:", error);
      toast.error("Failed to load accounts");
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const loadItems = async () => {
    setIsLoadingItems(true);
    try {
      const fetchedItems = await fetchQuickBooksItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error loading items:", error);
      toast.error("Failed to load products/services");
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleItemTypeChange = async (newType: 'account' | 'product' | null) => {
    setItemType(newType);
    
    // Save the itemType change immediately
    if (isEditing) {
      setIsSaving(true);
      try {
        const updateData: {
          itemType?: 'account' | 'product' | null;
          resourceId?: number | null;
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

  const handleAccountSelect = async (accountId: string, account: QuickBooksAccount) => {
    setSelectedResourceId(accountId);
    
    if (isEditing) {
      setIsSaving(true);
      try {
        const updateData = {
          itemType: 'account' as const,
          resourceId: parseInt(accountId, 10),
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

  const handleProductSelect = async (productId: string, product: QuickBooksItem) => {
    setSelectedResourceId(productId);
    
    if (isEditing) {
      setIsSaving(true);
      try {
        const updateData = {
          itemType: 'product' as const,
          resourceId: parseInt(productId, 10),
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
        <Select
          value={itemType || undefined}
          onValueChange={(value) => handleItemTypeChange(value as 'account' | 'product' | null)}
          disabled={!isEditing || isSaving}
        >
          <SelectTrigger id={`item-type-${lineItem.id}`} className="h-9">
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="account">Account</SelectItem>
            <SelectItem value="product">Product/Service</SelectItem>
          </SelectContent>
        </Select>
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
    </div>
  );
}

