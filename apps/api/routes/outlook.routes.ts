import { outlookController } from "@/controllers/outlook.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireSubscriptionAccess } from "@/middlewares/subscription.middleware";
import { Router } from "express";

const router = Router();

router.get("/auth", authenticate, outlookController.authRedirect);
router.get("/callback", outlookController.oauthCallback);
router.get("/emails", outlookController.syncEmails);
router.get("/emails/my", authenticate, outlookController.syncMyEmails);
router.post("/sync", authenticate, requireSubscriptionAccess, outlookController.syncMyEmails);
router.get("/attachments", authenticate, outlookController.getAttachments);
router.get(
  "/attachment/:id",
  authenticate,
  requireSubscriptionAccess,
  outlookController.getAttachmentWithId
);

// Get associated invoice for an attachment
router.get(
  "/attachments/:id/invoice",
  authenticate,
  requireSubscriptionAccess,
  outlookController.getAssociatedInvoice
);

// Delete an attachment
router.delete(
  "/attachments/:id",
  authenticate,
  requireSubscriptionAccess,
  outlookController.deleteAttachment
);

export default router;

