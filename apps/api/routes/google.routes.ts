import { authRedirect, oauthCallback } from "@/controllers/google.controller";
import { Router } from "express";

const router = Router();

router.get("/auth", authRedirect);
router.get("/callback", oauthCallback);


export default router;