import crypto from "crypto";
import { uploadBufferToS3 } from "@/helpers/s3upload";
import db from "@/lib/db";
import { emailAttachmentsModel } from "@/models/emails.model";
import { eq } from "drizzle-orm";
import { BadRequestError } from "@/helpers/errors";

export class UploadServices {
  uploadAttachment = async (
    userId: number,
    buffer: Buffer,
    filename: string,
    mimetype: string
  ) => {
    try {
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");

      const existing = await db
        .select()
        .from(emailAttachmentsModel)
        .where(eq(emailAttachmentsModel.id, hash));

      if (existing.length > 0) {
        throw new BadRequestError("Attachment already exists in the database");
      }

      const key = `attachments/${Date.now()}-${filename}`;
      const s3Url = await uploadBufferToS3(buffer, key, mimetype);

      const uploadToDb = await db
        .insert(emailAttachmentsModel)
        .values({
          id: hash,
          userId,
          filename,
          mimeType: mimetype,
          s3Url,
        })
        .returning();

      return uploadToDb;
    } catch (error: any) {
      throw error;
    }
  };
}

export const uploadServices = new UploadServices();
