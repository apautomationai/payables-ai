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
router.delete("/disconnect", authenticate, quickbooksController.disconnect);

export default router;
