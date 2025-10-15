import { BadRequestError, NotFoundError } from "@/helpers/errors";
import { attachmentServices } from "@/services/attachment.services";
import { invoiceServices } from "@/services/invoice.services";
import { Request, Response } from "express";

class ProcessorController {
  async getAttachmentInfo(req: Request, res: Response) {
    const { attachmentId } = req.params;

    const attachmentIdNumber = parseInt(attachmentId);
    if (isNaN(attachmentIdNumber)) {
      throw new BadRequestError("Invalid attachment ID");
    }
    try {
      const response = await attachmentServices.getAttachmentById(attachmentIdNumber);
      if (!response) {
        throw new NotFoundError("Attachment not found");
      }
      return res.status(201).json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateAttachment(req: Request, res: Response) {
    const { attachmentId } = req.params;
    const { status, ...updatedData } = req.body;
    const attachmentIdNumber = parseInt(attachmentId);
    if (isNaN(attachmentIdNumber)) {
      throw new BadRequestError("Invalid attachment ID");
    }
    const response = await attachmentServices.updateAttachment(attachmentIdNumber, {status, ...updatedData});
    return res.status(200).json({
      success: true,
      data: response,
    });
  }

  async createInvoice(req: Request, res: Response) {
    // This method implements upsert logic:
    // - If invoice with same invoice_number and attachment_id exists, update it if data differs
    // - Line items are always added to the invoice (existing or new)
    try {
      // Extract data from request body
      const {
        invoice_number,
        customer_name,
        vendor_name,
        invoice_date,
        due_date,
        total_amount,
        description,
        line_items,
        attachment_id,
        s3_pdf_key,
        s3_json_key,
      } = req.body;

      // Validate required fields
      if (!attachment_id) {
        throw new BadRequestError("Attachment ID is required");
      }

      if (!invoice_number || !vendor_name || !customer_name) {
        throw new BadRequestError("Invoice number, vendor name, and customer name are required");
      }

      if (!invoice_date || !due_date) {
        throw new BadRequestError("Invoice date and due date are required");
      }

      if (!total_amount) {
        throw new BadRequestError("Total amount is required");
      }

      // Resolve user ID
      let userId: number;
      //@ts-ignore
      if (req.user?.id) {
        //@ts-ignore
        userId = req.user.id;
      } else {
        const attachment = await attachmentServices.getAttachmentById(attachment_id);
        if (!attachment) {
          throw new NotFoundError("Attachment not found");
        }
        userId = attachment.userId;
      }

      // Parse dates
      const parsedInvoiceDate = new Date(invoice_date);
      const parsedDueDate = new Date(due_date);

      // Validate dates
      if (isNaN(parsedInvoiceDate.getTime())) {
        throw new BadRequestError("Invalid invoice date format");
      }

      if (isNaN(parsedDueDate.getTime())) {
        throw new BadRequestError("Invalid due date format");
      }

      // Prepare invoice data
      const invoiceData = {
        userId,
        attachmentId: attachment_id,
        invoiceNumber: invoice_number,
        vendorName: vendor_name,
        customerName: customer_name,
        invoiceDate: parsedInvoiceDate,
        dueDate: parsedDueDate,
        totalAmount: total_amount.toString(),
        description: description || "",
        fileKey: s3_pdf_key || "",
        s3JsonKey: s3_json_key || "",
      };

      // Prepare line items data
      const lineItemsData = line_items?.map((item: any) => ({
        item_name: item.item_name || "",
        quantity: item.quantity || 0,
        rate: item.unit_price || 0,
        amount: item.total_price || 0,
      })) || [];

      // Create or update invoice with line items
      const result = await invoiceServices.createInvoiceWithLineItems(
        invoiceData,
        lineItemsData
      );

      const { invoice, operation } = result;
      
      let message = "";
      let statusCode = 201;
      
      switch (operation) {
        case 'created':
          message = "Invoice created successfully";
          statusCode = 201;
          break;
        case 'updated':
          message = "Invoice updated successfully";
          statusCode = 200;
          break;
        case 'no_changes':
          message = "Invoice already exists with same data";
          statusCode = 200;
          break;
        default:
          message = "Invoice processed successfully";
          statusCode = 200;
      }

      return res.status(statusCode).json({
        success: true,
        data: invoice,
        operation,
        message,
      });
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

}
export const processorController = new ProcessorController();
