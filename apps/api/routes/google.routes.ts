import { authRedirect, getAttachments, oauthCallback, readEmails } from "@/controllers/google.controller";
import { Router } from "express";

const router = Router();

router.get("/auth", authRedirect);
router.get("/callback", oauthCallback);
router.get("/readEmails", readEmails);
router.get("/attachments", getAttachments)


export default router;