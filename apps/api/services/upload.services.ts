import crypto from "crypto";
import { uploadBufferToS3 } from "@/helpers/s3upload";
import db from "@/lib/db";
import { emailAttachmentsModel } from "@/models/emails.model";
import { eq } from "drizzle-orm";
import { BadRequestError, InternalServerError } from "@/helpers/errors";

export class UploadServices {
  uploadAttachment = async (
    buffer: Buffer,
    filename: string,
    mimetype: string
  ) => {
    try {
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");

      const existing = await db
        .select()
        .from(emailAttachmentsModel)
        .where(eq(emailAttachmentsModel.hashId, hash));

      if (existing.length > 0) {
        throw new BadRequestError("Attachment already exists in the database");
      }

      const key = `attachments/${Date.now()}-${filename}`;
      const s3Url = await uploadBufferToS3(buffer, key, mimetype);
      const attachmentData = {
        hash,
        filename,
        mimetype,
        s3Url,
      };

      return attachmentData;
    } catch (error: any) {
      throw error;
    }
  };
  createDbRecord = async (attInfo: any) => {
    try {
      const existing = await db
        .select()
        .from(emailAttachmentsModel)
        .where(eq(emailAttachmentsModel.hashId, attInfo.hash));

      if (existing.length > 0) {
        throw new BadRequestError("Attachment already exists in the database");
      }
      const uploadToDb = await db
        .insert(emailAttachmentsModel)
        .values({
          hashId: attInfo.hash,
          userId: attInfo.userId,
          filename: attInfo.filename,
          mimeType: attInfo.mimeType,
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
