import db from "@/lib/db";
import { attachmentsModel } from "@/models/attachments.model";
import { invoiceModel } from "@/models/invoice.model";
import { and, eq } from "drizzle-orm";
import { NotFoundError, BadRequestError } from "@/helpers/errors";


export class AttachmentServices {
  async getAttachmentById(attachmentId: number) {
    try {
      const [response] = await db
        .select()
        .from(attachmentsModel)
        .where(
          and(
            eq(attachmentsModel.id, attachmentId),
            eq(attachmentsModel.isDeleted, false)
          )
        );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateAttachment(attachmentId: number, updatedData: any) {
    try {
      const [response] = await db
        .update(attachmentsModel)
        .set(updatedData)
        .where(eq(attachmentsModel.id, attachmentId))
        .returning();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async softDeleteAttachment(attachmentId: number): Promise<void> {
    try {
      // Verify attachment exists and is not already deleted
      const [existingAttachment] = await db
        .select()
        .from(attachmentsModel)
        .where(eq(attachmentsModel.id, attachmentId));

      if (!existingAttachment) {
        throw new NotFoundError("Attachment not found");
      }

      if (existingAttachment.isDeleted) {
        throw new BadRequestError("Attachment has already been deleted");
      }

      // Perform soft delete
      const [result] = await db
        .update(attachmentsModel)
        .set({
          isDeleted: true,
          deletedAt: new Date(),
          updated_at: new Date()
        })
        .where(eq(attachmentsModel.id, attachmentId))
        .returning();

      if (!result) {
        throw new BadRequestError("Failed to delete attachment");
      }
    } catch (error) {
      console.error("Error soft deleting attachment:", error);
      throw error;
    }
  }

  async getAssociatedInvoice(attachmentId: number) {
    try {
      const [invoice] = await db
        .select()
        .from(invoiceModel)
        .where(
          and(
            eq(invoiceModel.attachmentId, attachmentId),
            eq(invoiceModel.isDeleted, false)
          )
        );
      return invoice || null;
    } catch (error) {
      console.error("Error getting associated invoice:", error);
      throw error;
    }
  }
}
export const attachmentServices = new AttachmentServices();
