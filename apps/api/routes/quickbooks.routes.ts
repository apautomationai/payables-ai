import { Router } from "express";
import { quickbooksController } from "@/controllers/quickbooks.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireSubscriptionAccess } from "@/middlewares/subscription.middleware";

const router = Router();

// OAuth routes
router.get("/auth", authenticate, requireSubscriptionAccess, quickbooksController.auth);
router.get("/callback", quickbooksController.callback);

// Protected routes (require authentication and subscription)
router.get("/status", authenticate, requireSubscriptionAccess, quickbooksController.getStatus);
router.get("/company", authenticate, requireSubscriptionAccess, quickbooksController.getCompanyInfo);
router.get("/customers", authenticate, requireSubscriptionAccess, quickbooksController.getCustomers);
router.get("/vendors", authenticate, requireSubscriptionAccess, quickbooksController.getVendors);
router.get("/invoices", authenticate, requireSubscriptionAccess, quickbooksController.getInvoices);
router.get("/line-items", authenticate, requireSubscriptionAccess, quickbooksController.getLineItems);
router.get("/invoice-line-items/:invoiceId", authenticate, requireSubscriptionAccess, quickbooksController.getInvoiceLineItems);
router.get("/search-items", authenticate, requireSubscriptionAccess, quickbooksController.searchItems);
router.get("/search-vendors", authenticate, requireSubscriptionAccess, quickbooksController.searchVendors);
router.get("/hierarchical-vendor-search", authenticate, requireSubscriptionAccess, quickbooksController.hierarchicalVendorSearch);
router.get("/search-customers", authenticate, requireSubscriptionAccess, quickbooksController.searchCustomers);
router.post("/create-item", authenticate, requireSubscriptionAccess, quickbooksController.createItem);
router.post("/create-vendor", authenticate, requireSubscriptionAccess, quickbooksController.createVendor);
router.post("/create-customer", authenticate, requireSubscriptionAccess, quickbooksController.createCustomer);
router.post("/create-bill", authenticate, requireSubscriptionAccess, quickbooksController.createBill);
router.delete("/disconnect", authenticate, requireSubscriptionAccess, quickbooksController.disconnect);

export default router;
