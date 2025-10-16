import db from "@/lib/db";
import { attachmentsModel } from "@/models/attachments.model";
import { eq } from "drizzle-orm";


export class AttachmentServices {
  async getAttachmentById(attachmentId: number) {
    try {
      const [response] = await db.select().from(attachmentsModel).where(eq(attachmentsModel.id, attachmentId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateAttachment(attachmentId: number, updatedData: any) {
    try {
      const [response] = await db.update(attachmentsModel).set(updatedData).where(eq(attachmentsModel.id, attachmentId)).returning();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
export const attachmentServices = new AttachmentServices();
