import { BadRequestError } from "@/helpers/errors";
import { invoiceServices } from "@/services/invoice.services";
import { Request, Response } from "express";
class InvoiceController {
  async insertInvoice(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userId = req.user.id;
      // const userId = 33;
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

      const invoiceDateTimestamp = new Date(invoiceDate);
      const dueDateTimestamp = new Date(dueDate);

      const exists = await invoiceServices.getInvoice(invoiceNumber);
      if (exists.success) {
        throw new BadRequestError("Invoice already exists");
      }

      const response = await invoiceServices.insertInvoice({
        userId,
        attachmentId,
        invoiceNumber,
        vendorName,
        customerName,
        invoiceDate: invoiceDateTimestamp,
        dueDate: dueDateTimestamp,
        totalAmount,
        currency,
        lineItems,
        invoiceUrl,
        costCode,
        quantity,
        rate,
        description,
      });

      if (!response.success) {
        return res.json({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.json({
        success: true,
        //@ts-ignore
        data: response.data,
      });
    } catch (error: any) {
      return res.json({
        success: false,
        error: error.message,
      });
    }
  }
  async getAllInvoices(req: Request, res: Response) {
    //@ts-ignore
    // const userId = req.user.id;
    const userId = 33;
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const response = await invoiceServices.getAllInvoices(
        userId,
        page,
        limit
      );
      if (!response.success) {
        return res.json({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.json({
        success: true,
        data: {
          //@ts-ignore
          invoices: response.data[0],
          pagination: {
            //@ts-ignore
            totalInvoices: response.data[1] || 0,
            page,
            limit,
            //@ts-ignore
            totalPages: Math.ceil((response.data[1] || 0) / limit),
          },
        },
      });
    } catch (error: any) {
      return res.json({
        success: false,
        error: error.message,
      });
    }
  }

  async getInvoice(req: Request, res: Response) {
    try {
      const invoiceNumber = req.params.id;

      const response = await invoiceServices.getInvoice(invoiceNumber);
      if (!response.success) {
        return res.json({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.json({
        success: true,
        //@ts-ignore
        data: response.data,
      });
    } catch (error: any) {
      return res.json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateInvoice(req: Request, res: Response) {
    try {
      const invoiceInfo = req.body;
      const response = await invoiceServices.updateInvoice(invoiceInfo);
      if (!response.success) {
        return res.json({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.json({
        success: true,
        //@ts-ignore
        data: response.data,
      });
    } catch (error: any) {
      return res.json({
        success: false,
        error: error.message,
      });
    }
  }
}
export const invoiceController = new InvoiceController();
