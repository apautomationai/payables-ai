import { Router } from "express";
import { settingsController } from "@/controllers/settings.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/integrations", authenticate, settingsController.getIntegrations);

export default router;
