import { Router } from "express";
import { settingsController } from "@/controllers/settings.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { requireSubscriptionAccess } from "@/middlewares/subscription.middleware";

const router = Router();

router.get("/integrations", authenticate, requireSubscriptionAccess, settingsController.getIntegrations);
router.patch("/update-status", authenticate, requireSubscriptionAccess, settingsController.updateStatus);
router.get(
  "/started-reading",
  authenticate,
  requireSubscriptionAccess,
  settingsController.getStartedReadingAt
);
router.delete(
  "/integration",
  authenticate,
  requireSubscriptionAccess,
  settingsController.deleteIntegration
);
router.patch("/update-start", authenticate, requireSubscriptionAccess, settingsController.updateStartReading);

export default router;
