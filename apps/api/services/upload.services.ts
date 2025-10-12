import db from "@/lib/db";
import { attachmentsModel } from "@/models/attachments.model";
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
        .insert(attachmentsModel)
        .values({
          userId: attInfo.userId,
          filename: attInfo.filename,
          mimeType: attInfo.mimeType,
          provider: "local",
          fileUrl: attInfo.fileUrl,
          fileKey:attInfo.fileKey
        })
        .returning();

      return uploadToDb;
    } catch (error: any) {
      if (error.isOperational) {
        throw error.message;
      }
      throw new InternalServerError("Internal server error");
    }
  };
}

export const uploadServices = new UploadServices();
