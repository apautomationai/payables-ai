import { googleController } from "@/controllers/google.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireSubscriptionAccess } from "@/middlewares/subscription.middleware";
import { Router } from "express";

const router = Router();

router.get("/auth", authenticate, googleController.authRedirect);
router.get("/callback", googleController.oauthCallback);
router.get("/emails", googleController.syncEmails);
router.get("/emails/my", authenticate, googleController.syncMyEmails);
router.post("/sync", authenticate, requireSubscriptionAccess, googleController.syncMyEmails);
router.get("/attachments", authenticate, googleController.getAttachments);
router.get(
  "/attachment/:id",
  authenticate,
  requireSubscriptionAccess,
  googleController.getAttachmentWithId
);

// Get associated invoice for an attachment
router.get(
  "/attachments/:id/invoice",
  authenticate,
  requireSubscriptionAccess,
  googleController.getAssociatedInvoice
);

// Delete an attachment
router.delete(
  "/attachments/:id",
  authenticate,
  requireSubscriptionAccess,
  googleController.deleteAttachment
);

export default router;
