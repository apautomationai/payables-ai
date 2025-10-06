import { NotFoundError } from "@/helpers/errors";
import db from "@/lib/db";
import { emailAttachmentsModel } from "@/models/emails.model";
import { invoiceModel } from "@/models/invoice.model";
import { count, desc, eq, getTableColumns } from "drizzle-orm";

export class InvoiceServices {
  async insertInvoice(data: typeof invoiceModel.$inferInsert) {
    const [response] = await db.insert(invoiceModel).values(data).returning();
    return response;
  }

  async getAllInvoices(userId: number, page: number, limit: number) {
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
        vendorName: invoiceModel.vendorName,
        invoiceDate: invoiceModel.invoiceDate,
        status: invoiceModel.status,
      })
      .from(invoiceModel)
      .leftJoin(
        emailAttachmentsModel,
        eq(invoiceModel.attachmentId, emailAttachmentsModel.id)
      )
      .where(eq(invoiceModel.userId, userId))
      .orderBy(desc(invoiceModel.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalResult] = await db
      .select({ count: count() })
      .from(invoiceModel)
      .where(eq(invoiceModel.userId, userId));

    return {
      invoices: allInvoices,
      totalCount: totalResult.count,
    };
  }

  async getInvoice(invoiceId: number) {
    const [response] = await db
      .select({
        ...getTableColumns(invoiceModel),
        sourcePdfUrl: emailAttachmentsModel.s3Url,
      })
      .from(invoiceModel)
      .leftJoin(
        emailAttachmentsModel,
        eq(invoiceModel.attachmentId, emailAttachmentsModel.id)
      )
      .where(eq(invoiceModel.id, invoiceId));

    if (!response) {
      throw new NotFoundError("No invoice found with that ID.");
    }

    return response;
  }

  async updateInvoice(
    invoiceId: number,
    invoiceInfo: Partial<typeof invoiceModel.$inferSelect>
  ) {
    const existingInvoice = await this.getInvoice(invoiceId);
    if (!existingInvoice) {
      throw new NotFoundError("No invoice found to update.");
    }

    const updateData = {
      vendorName: invoiceInfo.vendorName,
      customerName: invoiceInfo.customerName,
      invoiceDate: invoiceInfo.invoiceDate
        ? new Date(invoiceInfo.invoiceDate)
        : undefined,
      dueDate: invoiceInfo.dueDate ? new Date(invoiceInfo.dueDate) : undefined,
      totalAmount: invoiceInfo.totalAmount,
      currency: invoiceInfo.currency,
      lineItems: invoiceInfo.lineItems,
      costCode: invoiceInfo.costCode,
      quantity: invoiceInfo.quantity,
      rate: invoiceInfo.rate,
      description: invoiceInfo.description,
      status: invoiceInfo.status, // THIS IS THE FIX
      updatedAt: new Date(),
    };

    const [response] = await db
      .update(invoiceModel)
      .set(updateData)
      .where(eq(invoiceModel.id, invoiceId))
      .returning();

    return response;
  }
}

export const invoiceServices = new InvoiceServices();