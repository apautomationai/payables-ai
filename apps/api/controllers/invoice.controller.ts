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
        pdfUrl,
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
      console.log("exists", exists);
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
        pdfUrl,
        costCode,
        quantity,
        rate,
        description,
      });

      if (!response.success) {
        return res.send({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.send({
        success: true,
        //@ts-ignore
        data: response.data,
      });
    } catch (error: any) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  }
  async getAllInvoices(req: Request, res: Response) {
    try {
      const response = await invoiceServices.getAllInvoices();
      if (!response.success) {
        return res.send({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.send({
        success: true,
        //@ts-ignore
        data: response.data,
      });
    } catch (error: any) {
      return res.send({
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
        return res.send({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.send({
        success: true,
        //@ts-ignore
        data: response.data,
      });
    } catch (error: any) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  }

  async updateInvoice(req: Request, res: Response) {
    try {
      const invoiceInfo = req.body;
      const response = await invoiceServices.updateInvoice(invoiceInfo);
      console.log("controller", response);
      if (!response.success) {
        return res.send({
          success: false,
          //@ts-ignore
          error: response.error,
        });
      }
      return res.send({
        success: true,
        //@ts-ignore
        data: response.data,
      });
    } catch (error: any) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  }
}
export const invoiceController = new InvoiceController();
