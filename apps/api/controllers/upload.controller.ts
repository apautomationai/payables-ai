import { BadRequestError, InternalServerError } from "@/helpers/errors";
import { uploadServices } from "@/services/upload.services";
import { Request, Response } from "express";
export class UploadController {
  uploadAttachment = async (req: Request, res: Response) => {
    try {
      const buffer = Buffer.from(req.body!, "base64url");

      if (!buffer || buffer.length === 0) {
        throw new BadRequestError("Upload an attachment");
      }

      const mimetype =
        (req.headers["content-type"] as string) || "application/octet-stream";

      // Auto-generate filename if not provided
      const filename =
        (req.headers["x-filename"] as string) || `file-${Date.now()}`;
      //@ts-ignore
      const attachmentData = await uploadServices.uploadAttachment(
        buffer,
        filename,
        mimetype
      );

      const result = {
        status: "success",
        data: attachmentData,
      };

      return res.status(200).send(result);
    } catch (error: any) {
      if (error.isOperational) {
        return res.status(error.statusCode || 400).json({
          status: "error",
          message: error.message,
        });
      }
      throw new InternalServerError("Internal server error");
    }
  };

  createDbRecord = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      // const userId = 24;
      const bodyData = req.body;
      if (!userId) {
        throw new BadRequestError("Need a valid userId");
      }

      const attInfo = {
        id: bodyData.hash,
        userId: userId,
        filename: bodyData.filename,
        mimeType: bodyData.mimetype,
        s3Url: bodyData.s3Url,
      };
      console.log(attInfo);

      const response = await uploadServices.createDbRecord(attInfo);
      const result = {
        success: "success",
        data: response,
      };
      return res.status(200).send(result);
    } catch (error: any) {
      if (error.isOperational) {
        return res.status(error.statusCode || 400).json({
          status: "error",
          message: error.message,
        });
      }
      throw new InternalServerError("Internal server error");
    }
  };
}
export const uploadController = new UploadController();
