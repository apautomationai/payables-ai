// import { invoiceController } from "@/controllers/invoice.controller";
// import { authenticate } from "@/middlewares/auth.middleware";
// import { Router } from "express";

// const router = Router();
// router.post("/insert", authenticate, invoiceController.insertInvoice);
// router.get("/invoices", authenticate, invoiceController.getAllInvoices);
// router.get("/invoices/:id", authenticate, invoiceController.getInvoice);
// router.patch("/update-invoice", authenticate, invoiceController.updateInvoice);
// export default router;

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
router.patch("/invoices/:id", authenticate, invoiceController.updateInvoice);

export default router;
