import { googleController } from "@/controllers/google.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireSubscriptionAccess } from "@/middlewares/subscription.middleware";
import { Router } from "express";

const router = Router();

router.get("/auth", authenticate, requireSubscriptionAccess, googleController.authRedirect);
router.get("/callback", authenticate, requireSubscriptionAccess, googleController.oauthCallback);
router.get("/emails", googleController.readEmails);
router.get("/attachments", authenticate, requireSubscriptionAccess, googleController.getAttachments);
router.get(
  "/attachment/:id",
  authenticate,
  requireSubscriptionAccess,
  googleController.getAttachmentWithId
);

export default router;
