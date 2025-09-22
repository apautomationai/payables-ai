import { authRedirect, oauthCallback, readEmails } from "@/controllers/google.controller";
import { Router } from "express";

const router = Router();

router.get("/auth", authRedirect);
router.get("/callback", oauthCallback);
router.get("/readEmails", readEmails);


export default router;