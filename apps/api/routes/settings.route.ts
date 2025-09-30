import { Router } from "express";
import { settingsController } from "@/controllers/settings.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/integrations", authenticate, settingsController.getIntegrations);
router.patch("/update-status", authenticate, settingsController.updateStatus);

export default router;
