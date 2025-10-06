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
import { count, desc, eq, getTableColumns } from "drizzle-orm";
// import path from "path";
// import Tesseract from "tesseract.js";
// import { execSync } from "child_process";
const pdfParse = require("pdf-parse");
import { PDFDocument } from "pdf-lib";
import { uploadBufferToS3 } from "@/helpers/s3upload";

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

  async getAttachmentTexts(pdfBuffer: Buffer): Promise<string[]> {
    // Extract digital text
    const parsed = await pdfParse(pdfBuffer);

    // if (parsed.text && parsed.text.trim().length > 20) {
    // Split by page marker like "Page X of Y"
    const pages = parsed.text
      .split(/Page \d+ of \d+/) // split using the page pattern
      .map((p: any) => p.trim()) // remove extra whitespace
      .filter((p: any) => p.length > 0); // remove empty pages

    return pages;
    // }

    // Fallback: scanned PDF → OCR
    // const tempDir = path.join(__dirname, "../../temp_images");
    // if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // const outputBase = path.join(tempDir, "page");
    // execSync(`pdftoppm -png "${pdfPath}" "${outputBase}"`);

    // const imageFiles = fs
    //   .readdirSync(tempDir)
    //   .filter((f) => f.endsWith(".png"))
    //   .sort(
    //     (a, b) =>
    //       parseInt(a.match(/\d+/)?.[0] || "0") -
    //       parseInt(b.match(/\d+/)?.[0] || "0")
    //   );

    // const results: string[] = [];
    // for (const imageFile of imageFiles) {
    //   const imagePath = path.join(tempDir, imageFile);
    //   const { data } = await Tesseract.recognize(imagePath, "eng");

    //   const text = data.text.trim();
    //   if (text.length > 0) {
    //     results.push(text);
    //   }
    // }

    // imageFiles.forEach((f) => fs.unlinkSync(path.join(tempDir, f)));
    // console.log("result ", results);

    // return results;
  }

  // --- New method to detect invoices ---
  async extractInvoices(pdfBuffer: Buffer) {
    let pages = await this.getAttachmentTexts(pdfBuffer);

    const invoices: any[] = [];
    let currentInvoice: any = null;

    for (let i = 0; i < pages.length; i++) {
      const text = pages[i].trim();
      if (!text) continue; // skip empty pages

      // Match invoice number (adjust regex if needed)

      const invoiceMatch = text.match(
        /INVOICE\s*(NUMBER|No\.?)?\s*[:#]?\s*(\d+)/i
      );
      if (invoiceMatch) {
        // Save previous invoice
        if (currentInvoice) {
          currentInvoice.endPage = i;
          currentInvoice.pageCount =
            currentInvoice.endPage - currentInvoice.startPage + 1;
          invoices.push(currentInvoice);
        }

        // Start new invoice
        currentInvoice = {
          invoiceNumber: invoiceMatch[2],
          startPage: i + 1,
          endPage: i + 1,
          pageCount: 1,
        };
      } else if (currentInvoice) {
        // Extend current invoice
        currentInvoice.endPage = i + 1;
        currentInvoice.pageCount =
          currentInvoice.endPage - currentInvoice.startPage + 1;
      }
    }

    // Save last invoice
    if (currentInvoice) {
      currentInvoice.endPage = Math.min(
        currentInvoice.endPage,
        pages.length - 1
      );
      currentInvoice.pageCount =
        currentInvoice.endPage - currentInvoice.startPage + 1;
      invoices.push(currentInvoice);
    }

    return {
      success: true,
      totalPages: pages.length,
      totalInvoices: invoices.length,
      invoices,
    };
  }

  async splitInvoicesPdf(pdfBuffer: Buffer) {
    const originalPdf = await PDFDocument.load(pdfBuffer);

    const splitResults: any[] = [];
    const invoiceData = await this.extractInvoices(pdfBuffer);

    for (const inv of invoiceData.invoices) {
      const { startPage, endPage, invoiceNumber } = inv;

      try {
        const newPdf = await PDFDocument.create();

        // Copy pages safely in a separate array
        for (let i = startPage - 1; i < endPage; i++) {
          const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
          newPdf.addPage(copiedPage);
        }

        const newPdfBytes = await newPdf.save();

        // Upload directly to S3
        const s3Key = `invoices/Invoice_${invoiceNumber}.pdf`;
        const s3Url = await uploadBufferToS3(
          Buffer.from(newPdfBytes),
          s3Key,
          "application/pdf"
        );

        const inserted = await this.insertInvoice({
          userId: 33,
          attachmentId: 164,
          invoiceNumber: invoiceNumber as string,
          invoiceUrl: s3Url,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(inserted);
        splitResults.push({
          invoiceNumber,
          startPage,
          endPage,
          pageCount: endPage - startPage + 1,
          s3Url,
        });
      } catch (err) {
        console.error(`Error splitting invoice ${invoiceNumber}:`, err);
      }
    }

    return {
      success: true,
      totalInvoices: splitResults.length,
      invoices: splitResults,
    };
  }
}
export const invoiceServices = new InvoiceServices();
