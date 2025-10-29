import { googleController } from "@/controllers/google.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/auth", authenticate, googleController.authRedirect);
router.get("/callback", authenticate, googleController.oauthCallback);
router.get("/emails", googleController.syncEmails);
router.get("/attachments", authenticate, googleController.getAttachments);
router.get(
  "/attachment/:id",
  authenticate,
  googleController.getAttachmentWithId
);

export default router;
