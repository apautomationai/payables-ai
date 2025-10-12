import { BadRequestError } from "@/helpers/errors";
import { uploadServices } from "@/services/upload.services";
import { Request, Response } from "express";

export class UploadController {
  uploadAttachment = async (req: Request, res: Response) => {
    try {
      // FIX: Changed req.body to req.query to correctly handle GET request parameters.
      const { filename, mimetype } = req.query as {
        filename: string;
        mimetype: string;
      };

      if (!filename || !mimetype) {
        throw new BadRequestError(
          "Filename and mimetype are required query parameters."
        );
      }

      const response = await uploadServices.uploadAttachment(
        filename,
        mimetype
      );

      if (!response.success) {
        return res.status(400).json({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }

      return res.status(200).json(response.data);
    } catch (error: any) {
      if (error.isOperational) {
        return res.status(error.statusCode || 400).json({
          status: "error",
          message: error.message,
        });
      }
      console.error("UNEXPECTED_ERROR in uploadAttachment:", error);
      // Return a generic error message for unexpected errors
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };

  createDbRecord = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const bodyData = req.body;
      if (!userId) {
        throw new BadRequestError("A valid user ID is required.");
      }

      console.log('bodyData', bodyData);

      const attInfo = {
        userId: userId,
        filename: bodyData.filename,
        mimeType: bodyData.mimetype,
        fileUrl: bodyData.fileUrl,
        fileKey: bodyData.fileKey,
      };

      const [response] = await uploadServices.createDbRecord(attInfo);
      const result = {
        success: true,
        data: response,
      };
      return res.status(201).send(result);
    } catch (error: any) {
      if (error.isOperational) {
        return res.status(error.statusCode || 400).json({
          success: false,
          message: error.message,
        });
      }
      console.error("UNEXPECTED_ERROR in createDbRecord:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
}

export const uploadController = new UploadController();
