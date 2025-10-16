import { Router } from "express";
import { processorController } from "@/controllers/processor.controller";

const router = Router();

// Create a new invoice
router.get("/attachments/:attachmentId", processorController.getAttachmentInfo);
router.patch("/attachments/:attachmentId", processorController.updateAttachment);
router.post("/invoices", processorController.createInvoice);


export default router;
