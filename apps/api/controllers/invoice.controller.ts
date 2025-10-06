import { BadRequestError } from "@/helpers/errors";
import { invoiceServices } from "@/services/invoice.services";
import { Request, Response } from "express";

class InvoiceController {
  async insertInvoice(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const {
        attachmentId,
        invoiceNumber,
        vendorName,
        customerName,
        invoiceDate,
        dueDate,
        totalAmount,
        currency,
        lineItems,
        invoiceUrl,
        costCode,
        quantity,
        rate,
        description,
      } = req.body;

      if (!invoiceDate || !dueDate) {
        throw new BadRequestError("Invoice date and due date are required");
      }

      const response = await invoiceServices.insertInvoice({
        userId,
        attachmentId,
        invoiceNumber,
        vendorName,
        customerName,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        totalAmount,
        currency,
        lineItems,
        invoiceUrl,
        costCode,
        quantity,
        rate,
        description,
      });

      return res.status(201).json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAllInvoices(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const { invoices, totalCount } = await invoiceServices.getAllInvoices(
        userId,
        page,
        limit
      );

      return res.json({
        success: true,
        data: {
          invoices: invoices,
          pagination: {
            totalInvoices: totalCount || 0,
            page,
            limit,
            totalPages: Math.ceil((totalCount || 0) / limit),
          },
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getInvoice(req: Request, res: Response) {
    try {
      // UPDATED: Parse the 'id' from URL parameter into a number
      const invoiceId = parseInt(req.params.id, 10);
      if (isNaN(invoiceId)) {
        throw new BadRequestError("Invoice ID must be a valid number.");
      }

      const response = await invoiceServices.getInvoice(invoiceId);

      return res.json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateInvoice(req: Request, res: Response) {
    try {
      // UPDATED: Parse the 'id' from URL parameter into a number
      const invoiceId = parseInt(req.params.id, 10);
      if (isNaN(invoiceId)) {
        throw new BadRequestError("Invoice ID must be a valid number.");
      }

      const invoiceInfo = req.body;
      const response = await invoiceServices.updateInvoice(
        invoiceId,
        invoiceInfo
      );

      return res.json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
export const invoiceController = new InvoiceController();
