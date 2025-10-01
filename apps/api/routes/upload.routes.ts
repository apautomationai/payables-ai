import { uploadController } from "@/controllers/upload.controller";
// import { authenticate } from "@/middlewares/auth.middleware";
import express, { Router } from "express";

const router = Router();

router.post(
  "/upload-attachment",
  // authenticate,
  express.raw({ type: "*/*", limit: "10mb" }),
  uploadController.uploadAttachment
);
router.post(
  "/create-record",
  uploadController.createDbRecord
);

export default router;
