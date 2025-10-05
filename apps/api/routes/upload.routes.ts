import { uploadController } from "@/controllers/upload.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get(
  "/upload-attachment",
  authenticate,
  uploadController.uploadAttachment
);
router.post("/create-record", authenticate, uploadController.createDbRecord);

export default router;
