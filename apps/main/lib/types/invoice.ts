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
  vendorAddress: string | null;
  vendorPhone: string | null;
  vendorEmail: string | null;
  customerName: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  totalAmount: string | null;
  currency: string | null;
  totalTax: string | null;
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
  id: number;
  invoiceId: number;
  item_name: string | null;
  description: string | null;
  quantity: string | null;
  rate: string | null;
  amount: string | null;
  itemType?: 'account' | 'product' | null;
  resourceId?: number | null;
}