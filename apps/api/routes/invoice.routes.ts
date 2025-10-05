import { invoiceController } from "@/controllers/invoice.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();
router.post("/insert",  invoiceController.insertInvoice);
router.get("/invoices", authenticate, invoiceController.getAllInvoices);
router.get("/invoices/:id", invoiceController.getInvoice);
router.patch("/update-invoice", invoiceController.updateInvoice);
export default router;
