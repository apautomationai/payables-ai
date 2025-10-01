import { Router } from "express";
import { settingsController } from "@/controllers/settings.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/integrations", authenticate, settingsController.getIntegrations);
router.patch("/update-status", authenticate, settingsController.updateStatus);
router.get(
  "/started-reading",
  authenticate,
  settingsController.getStartedReadingAt
);
router.delete(
  "/integration",
  authenticate,
  settingsController.deleteIntegration
);

export default router;
