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

  /**
   * Retrieves a paginated list of all invoices for a specific user.
   */
  async getAllInvoices(userId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;

    // Query for the paginated list of invoices
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

        // Added vendorName for the list view
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

    // Query for the total count of invoices for that user
    const [totalResult] = await db
      .select({ count: count() })
      .from(invoiceModel)
      .where(eq(invoiceModel.userId, userId));

    // UPDATED: Return a structured object instead of an array for better clarity
    return {
      invoices: allInvoices,
      totalCount: totalResult.count,
    };
  }

  async getInvoice(invoiceNumber: string) {
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
      .where(eq(invoiceModel.invoiceNumber, invoiceNumber));

    if (!response) {
      throw new NotFoundError("No invoice found with that number.");
    }

    return response;
  }

  /**
   * Updates an existing invoice.
   */
  async updateInvoice(
    invoiceNumber: string,
    invoiceInfo: Partial<typeof invoiceModel.$inferSelect>
  ) {
    // First, check if the invoice exists
    const existingInvoice = await this.getInvoice(invoiceNumber);
    if (!existingInvoice) {
      throw new NotFoundError("No invoice found to update.");
    }

    // UPDATED: Create a secure object with only the fields allowed to be updated.

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

    const [response] = await db
      .update(invoiceModel)
      .set(updateData)
      .where(eq(invoiceModel.invoiceNumber, invoiceNumber))
      .returning();

    return response;
  }
}

export const invoiceServices = new InvoiceServices();
