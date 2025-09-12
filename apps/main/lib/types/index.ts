export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type InvoiceStatus = "Pending" | "Completed" | "Requires Attention";

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  pdfUrl: string;
  extractedText?: string;
}
