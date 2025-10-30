import { authController } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);

export default router;

