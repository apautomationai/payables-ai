import { invoiceController } from "@/controllers/invoice.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireSubscriptionAccess } from "@/middlewares/subscription.middleware";
import { Router } from "express";

const router = Router();

// Get dashboard metrics
router.get("/dashboard", authenticate, requireSubscriptionAccess, invoiceController.getDashboardMetrics);

// Create a new invoice
router.post("/invoices", authenticate, requireSubscriptionAccess, invoiceController.insertInvoice);

// Get all invoices (paginated)
router.get("/invoices", authenticate, requireSubscriptionAccess, invoiceController.getAllInvoices);

// Get a single invoice by its ID
router.get("/invoices/:id", authenticate, requireSubscriptionAccess, invoiceController.getInvoice);

// Update a single invoice by its ID
router.patch("/:id", authenticate, requireSubscriptionAccess, invoiceController.updateInvoice);

// Update invoice status
router.patch("/:id/status", authenticate, requireSubscriptionAccess, invoiceController.updateInvoiceStatus);

// Delete an invoice
router.delete("/invoices/:id", authenticate, requireSubscriptionAccess, invoiceController.deleteInvoice);

router.post("/split", authenticate, requireSubscriptionAccess, invoiceController.splitInvoices);

// Get all line items (for debugging)
router.get("/line-items", authenticate, requireSubscriptionAccess, invoiceController.getAllLineItems);

// Get line items by item name (using query parameter to handle special characters)
router.get("/line-items/search", authenticate, requireSubscriptionAccess, invoiceController.getLineItemsByName);

// Get line items by invoice ID
router.get("/line-items/invoice/:invoiceId", authenticate, requireSubscriptionAccess, invoiceController.getLineItemsByInvoiceId);

// Update a line item
router.patch("/line-items/:id", authenticate, requireSubscriptionAccess, invoiceController.updateLineItem);

// Delete a line item
router.delete("/line-items/:id", authenticate, requireSubscriptionAccess, invoiceController.deleteLineItem);

export default router;
