import { invoiceController } from "@/controllers/invoice.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();
router.post("/insert", authenticate, invoiceController.insertInvoice);
router.get("/invoices", authenticate, invoiceController.getAllInvoices);
router.get("/invoices/:id", authenticate, invoiceController.getInvoice);
router.patch("/update-invoice", authenticate, invoiceController.updateInvoice);
export default router;
