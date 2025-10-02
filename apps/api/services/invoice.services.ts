import { NotFoundError } from "@/helpers/errors";
import db from "@/lib/db";
import { invoiceModel } from "@/models/invoice.model";
import { eq } from "drizzle-orm";

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

  async getAllInvoices() {
    try {
      const allInvoices = await db.select().from(invoiceModel);
      const result = {
        success: true,
        data: allInvoices,
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
