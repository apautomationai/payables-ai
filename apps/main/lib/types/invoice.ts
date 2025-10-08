// @/lib/types/invoice.ts

export type Attachment = {
  id: string;
  userId: number;
  email: string;
  filename: string;
  mimeType: string;
  sender: string;
  receiver: string;
  fileUrl: string;
  fileKey: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceStatus = "pending" | "approved" | "rejected" | "failed" | "not_connected";

export type InvoiceListItem = {
  id: number;
  invoiceNumber: string;
  vendorName: string | null;
  totalAmount: string | null;
  status: InvoiceStatus | null;
  createdAt: string;
};

export interface InvoiceDetails {
  id: number;
  userId: number;
  attachmentId: number;
  invoiceNumber: string;
  vendorName: string | null;
  customerName: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  totalAmount: string | null;
  currency: string | null;
  lineItems: string | null;
  costCode: string | null;
  quantity: string | null;
  rate: string | null;
  description: string | null;
  status: InvoiceStatus | null;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
  sourcePdfUrl: string | null;
}


export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  // Add other fields as needed
}