import { googleController } from "@/controllers/google.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/auth", authenticate, googleController.authRedirect);
router.get("/callback", authenticate, googleController.oauthCallback);
router.get("/readEmails", googleController.readEmails);
router.get("/attachments", googleController.getAttachments);

export default router;
