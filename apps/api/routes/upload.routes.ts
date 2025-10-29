import { uploadController } from "@/controllers/upload.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireSubscriptionAccess } from "@/middlewares/subscription.middleware";
import { Router } from "express";

const router = Router();

router.get(
  "/upload-attachment",
  authenticate,
  requireSubscriptionAccess,
  uploadController.uploadAttachment
);
router.post("/create-record", authenticate, requireSubscriptionAccess, uploadController.createDbRecord);

export default router;
