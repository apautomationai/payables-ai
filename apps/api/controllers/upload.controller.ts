import { BadRequestError, InternalServerError } from "@/helpers/errors";
import { uploadServices } from "@/services/upload.services";
import { Request, Response } from "express";
export class UploadController {
  uploadAttachment = async (req: Request, res: Response) => {
    try {
      const { filename, mimetype } = req.body;

      const response = await uploadServices.uploadAttachment(
        filename,
        mimetype
      );
      if (!response.success) {
        return res.json({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.json(response.data);
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
      // const userId = 33
      const bodyData = req.body;
      if (!userId) {
        throw new BadRequestError("Need a valid userId");
      }

      const attInfo = {
        userId: userId,
        filename: bodyData.filename,
        mimeType: bodyData.mimetype,
        s3Url: bodyData.s3Url,
      };

      const [response] = await uploadServices.createDbRecord(attInfo);
      const result = {
        success: true,
        data: response,
      };
      return res.status(200).send(result);
    } catch (error: any) {
      if (error.isOperational) {
        return res.status(error.statusCode || 400).json({
          success: false,
          message: error.message,
        });
      }
      throw new InternalServerError("Internal server error");
    }
  };
}
export const uploadController = new UploadController();
