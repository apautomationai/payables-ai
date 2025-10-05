// import { NotFoundError } from "@/helpers/errors";
// import db from "@/lib/db";
// import { emailAttachmentsModel } from "@/models/emails.model";
// import { invoiceModel } from "@/models/invoice.model";
// import { asc, count, eq } from "drizzle-orm";

// export class InvoiceServices {
//   async insertInvoice(data: any) {
//     try {
//       const [response] = await db.insert(invoiceModel).values(data).returning();
//       const result = {
//         success: true,
//         data: response,
//       };
//       return result;
//     } catch (error: any) {
//       const result = {
//         success: false,
//         error: error.message,
//       };
//       return result;
//     }
//   }

//   async getAllInvoices(userId: number, page: number, limit: number) {
//     try {
//       const offset = (page - 1) * limit;
//       const allInvoices = await db
//         .select({
//           id: invoiceModel.id,
//           userId: invoiceModel.userId,
//           invoiceNumber: invoiceModel.invoiceNumber,
//           totalAmount: invoiceModel.totalAmount,
//           attachmentId: invoiceModel.attachmentId,
//           attachmentUrl: emailAttachmentsModel.s3Url,
//           createdAt: invoiceModel.createdAt,
//         })
//         .from(invoiceModel)
//         .leftJoin(
//           emailAttachmentsModel,
//           eq(invoiceModel.attachmentId, emailAttachmentsModel.id)
//         )
//         .where(eq(invoiceModel.userId, userId))
//         .orderBy(asc(invoiceModel.createdAt))
//         .limit(limit)
//         .offset(offset);

//       const [invoices] = await db
//         .select({ count: count() })
//         .from(invoiceModel)
//         .where(eq(invoiceModel.userId, userId));

//       const totalInvoice = invoices.count;
//       const result = {
//         success: true,
//         data: [allInvoices, totalInvoice],
//       };

//       return result;
//     } catch (error: any) {
//       const result = {
//         success: false,
//         error: error.message,
//       };
//       return result;
//     }
//   }
//   async getInvoice(invoiceNumber: string) {
//     try {
//       const [response] = await db
//         .select()
//         .from(invoiceModel)
//         .where(eq(invoiceModel.invoiceNumber, invoiceNumber));

//       if (!response) {
//         throw new NotFoundError("No invoice found");
//       }

//       const result = {
//         success: true,
//         data: response,
//       };
//       return result;
//     } catch (error: any) {
//       const result = {
//         success: false,
//         error: error.message,
//       };
//       return result;
//     }
//   }

//   async updateInvoice(invoiceInfo: any) {
//     try {
//       invoiceInfo.invoiceDate = new Date(invoiceInfo.invoiceDate);
//       invoiceInfo.dueDate = new Date(invoiceInfo.dueDate);
//       invoiceInfo.updatedAt = new Date();
//       const invoice = await this.getInvoice(invoiceInfo.invoiceNumber);
//       if (!invoice.success) {
//         throw new NotFoundError("No invoice found");
//       }

//       const [response] = await db
//         .update(invoiceModel)
//         .set(invoiceInfo)
//         .where(eq(invoiceModel.invoiceNumber, invoiceInfo.invoiceNumber))
//         .returning();
//       const result = {
//         success: true,
//         data: response,
//       };
//       return result;
//     } catch (error: any) {
//       const result = {
//         success: false,
//         error: error.message,
//       };
//       return result;
//     }
//   }
// }

// export const invoiceServices = new InvoiceServices();

import { NotFoundError } from "@/helpers/errors";
import db from "@/lib/db";
import { emailAttachmentsModel } from "@/models/emails.model";
import { invoiceModel } from "@/models/invoice.model";
import { asc, count, eq, getTableColumns } from "drizzle-orm";

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

    const [totalResult] = await db
      .select({ count: count() })
      .from(invoiceModel)
      .where(eq(invoiceModel.userId, userId));

    return {
      invoices: allInvoices,
      totalCount: totalResult.count,
    };
  }

  // UPDATED: Now accepts a numeric 'invoiceId'
  async getInvoice(invoiceId: number) {
    // UPDATED: Queries by the 'id' column
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

  // UPDATED: Now accepts a numeric 'invoiceId'
  async updateInvoice(
    invoiceId: number,
    invoiceInfo: Partial<typeof invoiceModel.$inferSelect>
  ) {
    // UPDATED: Checks for existence using the numeric 'id'
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
      updatedAt: new Date(),
    };

    // UPDATED: Updates the record where the 'id' matches
    const [response] = await db
      .update(invoiceModel)
      .set(updateData)
      .where(eq(invoiceModel.id, invoiceId))
      .returning();

    return response;
  }
}

export const invoiceServices = new InvoiceServices();
