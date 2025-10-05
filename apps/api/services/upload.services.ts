import db from "@/lib/db";
import { emailAttachmentsModel } from "@/models/emails.model";
import { InternalServerError } from "@/helpers/errors";
import { generateSignUrl } from "@/helpers/s3upload";

export class UploadServices {
  uploadAttachment = async (filename: string, mimetype: string) => {
    try {
      const response = await generateSignUrl(filename, mimetype);
      return {
        success: true,
        data: {
          signedUrl: response.url,
          key: response.key,
          publicUrl: response.publicUrl,
        },
      };
    } catch (error: any) {
      throw error;
    }
  };
  createDbRecord = async (attInfo: any) => {
    try {
      const uploadToDb = await db
        .insert(emailAttachmentsModel)
        .values({
          userId: attInfo.userId,
          filename: attInfo.filename,
          mimeType: attInfo.mimeType,
          provider: "local",
          s3Url: attInfo.s3Url,
        })
        .returning();

      return uploadToDb;
    } catch (error: any) {
      if (error.isOperational) {
        return error.message;
      }
      throw new InternalServerError("Internal server error");
    }
  };
}

export const uploadServices = new UploadServices();
