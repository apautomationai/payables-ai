import { invoiceController } from "@/controllers/invoice.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

// Create a new invoice
router.post("/invoices", authenticate, invoiceController.insertInvoice);

// Get all invoices (paginated)
router.get("/invoices", authenticate, invoiceController.getAllInvoices);

// Get a single invoice by its ID
router.get("/invoices/:id", authenticate, invoiceController.getInvoice);

// Update a single invoice by its ID
router.patch("/:id", authenticate, invoiceController.updateInvoice);

// Update invoice status
router.patch("/:id/status", authenticate, invoiceController.updateInvoiceStatus);

router.post("/split", authenticate, invoiceController.splitInvoices);

// Get all line items (for debugging)
router.get("/line-items", authenticate, invoiceController.getAllLineItems);

// Get line items by item name (using query parameter to handle special characters)
router.get("/line-items/search", authenticate, invoiceController.getLineItemsByName);

// Get line items by invoice ID
router.get("/line-items/invoice/:invoiceId", authenticate, invoiceController.getLineItemsByInvoiceId);

export default router;
