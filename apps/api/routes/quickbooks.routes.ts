import { Router } from "express";
import { quickbooksController } from "@/controllers/quickbooks.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

// OAuth routes
router.get("/auth", authenticate, quickbooksController.auth);
router.get("/callback", quickbooksController.callback);

// Protected routes (require authentication)
router.get("/status", authenticate, quickbooksController.getStatus);
router.get("/company", authenticate, quickbooksController.getCompanyInfo);
router.get("/customers", authenticate, quickbooksController.getCustomers);
router.get("/vendors", authenticate, quickbooksController.getVendors);
router.get("/invoices", authenticate, quickbooksController.getInvoices);
router.get("/line-items", authenticate, quickbooksController.getLineItems);
router.get("/invoice-line-items/:invoiceId", authenticate, quickbooksController.getInvoiceLineItems);
router.get("/search-items", authenticate, quickbooksController.searchItems);
router.get("/search-vendors", authenticate, quickbooksController.searchVendors);
router.get("/search-customers", authenticate, quickbooksController.searchCustomers);
router.post("/create-item", authenticate, quickbooksController.createItem);
router.post("/create-vendor", authenticate, quickbooksController.createVendor);
router.post("/create-customer", authenticate, quickbooksController.createCustomer);
router.post("/create-bill", authenticate, quickbooksController.createBill);
router.delete("/disconnect", authenticate, quickbooksController.disconnect);

export default router;
