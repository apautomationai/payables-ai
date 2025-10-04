import { NotFoundError } from "@/helpers/errors";
import db from "@/lib/db";
import { emailAttachmentsModel } from "@/models/emails.model";
import { invoiceModel } from "@/models/invoice.model";
import { asc, count, eq } from "drizzle-orm";

export class InvoiceServices {
  async insertInvoice(data: any) {
    try {
      const [response] = await db.insert(invoiceModel).values(data).returning();
      const result = {
        success: true,
        data: response,
      };
      return result;
    } catch (error: any) {
      const result = {
        success: false,
        error: error.message,
      };
      return result;
    }
  }

  async getAllInvoices(userId: number, page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const allInvoices = await db
        .select({
          id: invoiceModel.id,
          userId: invoiceModel.userId,
          invoiceNumber: invoiceModel.invoiceNumber,
          totalAmount: invoiceModel.totalAmount,
          attachmentId: invoiceModel.attachmentId,
          attachmentUrl: emailAttachmentsModel.s3Url,
          createdAt: invoiceModel.createdAt,
        })
        .from(invoiceModel)
        .leftJoin(
          emailAttachmentsModel,
          eq(invoiceModel.attachmentId, emailAttachmentsModel.id)
        )
        .where(eq(invoiceModel.userId, userId))
        .orderBy(asc(invoiceModel.createdAt))
        .limit(limit)
        .offset(offset);

      const [invoices] = await db
        .select({ count: count() })
        .from(invoiceModel)
        .where(eq(invoiceModel.userId, userId));

      const totalInvoice = invoices.count;
      const result = {
        success: true,
        data: [allInvoices, totalInvoice],
      };

      return result;
    } catch (error: any) {
      const result = {
        success: false,
        error: error.message,
      };
      return result;
    }
  }
  async getInvoice(invoiceNumber: string) {
    try {
      const [response] = await db
        .select()
        .from(invoiceModel)
        .where(eq(invoiceModel.invoiceNumber, invoiceNumber));

      if (!response) {
        throw new NotFoundError("No invoice found");
      }

      const result = {
        success: true,
        data: response,
      };
      return result;
    } catch (error: any) {
      const result = {
        success: false,
        error: error.message,
      };
      return result;
    }
  }

  async updateInvoice(invoiceInfo: any) {
    try {
      invoiceInfo.invoiceDate = new Date(invoiceInfo.invoiceDate);
      invoiceInfo.dueDate = new Date(invoiceInfo.dueDate);
      invoiceInfo.updatedAt = new Date();
      const invoice = await this.getInvoice(invoiceInfo.invoiceNumber);
      if (!invoice.success) {
        throw new NotFoundError("No invoice found");
      }

      const [response] = await db
        .update(invoiceModel)
        .set(invoiceInfo)
        .where(eq(invoiceModel.invoiceNumber, invoiceInfo.invoiceNumber))
        .returning();
      const result = {
        success: true,
        data: response,
      };
      return result;
    } catch (error: any) {
      const result = {
        success: false,
        error: error.message,
      };
      return result;
    }
  }
}

export const invoiceServices = new InvoiceServices();
