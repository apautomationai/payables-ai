"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Plus, Loader2 } from "lucide-react";
import { client } from "@/lib/axios-client";
import { toast } from "sonner";
import type { LineItem } from "@/lib/types/invoice";

interface AddLineItemDialogProps {
    invoiceId: number;
    onLineItemAdded: (newLineItem: LineItem) => void;
}

export function AddLineItemDialog({ invoiceId, onLineItemAdded }: AddLineItemDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        item_name: "",
        description: "",
        quantity: "1",
        rate: "0",
        amount: "0",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            // Auto-calculate amount when quantity or rate changes
            if (name === "quantity" || name === "rate") {
                const qty = parseFloat(name === "quantity" ? value : updated.quantity) || 0;
                const rt = parseFloat(name === "rate" ? value : updated.rate) || 0;
                updated.amount = (qty * rt).toFixed(2);
            }

            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.item_name.trim()) {
            toast.error("Item name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const response: any = await client.post("/api/v1/invoice/line-items", {
                invoiceId,
                item_name: formData.item_name,
                description: formData.description || null,
                quantity: formData.quantity,
                rate: formData.rate,
                amount: formData.amount,
            });

            if (response.success) {
                toast.success("Line item added successfully");
                onLineItemAdded(response.data);
                setIsOpen(false);
                // Reset form
                setFormData({
                    item_name: "",
                    description: "",
                    quantity: "1",
                    rate: "0",
                    amount: "0",
                });
            }
        } catch (error) {
            console.error("Error adding line item:", error);
            toast.error("Failed to add line item");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="gap-2 w-full">
                    <Plus className="h-4 w-4" />
                    Add Line Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Line Item</DialogTitle>
                        <DialogDescription>
                            Add a new line item to this invoice. Fill in the details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="item_name">
                                Item Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="item_name"
                                name="item_name"
                                value={formData.item_name}
                                onChange={handleInputChange}
                                placeholder="Enter item name"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter description (optional)"
                                rows={3}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rate">Rate ($)</Label>
                                <Input
                                    id="rate"
                                    name="rate"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.rate}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount ($)</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="bg-muted"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Line Item"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
