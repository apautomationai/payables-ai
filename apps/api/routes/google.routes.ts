import {
  authRedirect,
  // getAttachments,
  //   getAttachments,
  oauthCallback,
  readEmails,
} from "@/controllers/google.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/auth", authenticate, authRedirect);
router.get("/callback", authenticate, oauthCallback);
router.get("/readEmails", readEmails);
// router.get("/attachments", getAttachments);

export default router;
