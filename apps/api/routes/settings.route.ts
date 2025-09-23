import { Router } from "express";
import {settingsController} from "@/controllers/settings.controller";

const router = Router();

router.get("/integrations", settingsController.getIntegrations);

export default router;
