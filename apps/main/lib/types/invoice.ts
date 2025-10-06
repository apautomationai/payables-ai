// @/lib/types/invoice.ts

export type Attachment = {
  id: string;
  userId: number;
  email: string;
  filename: string;
  mimeType: string;
  sender: string;
  receiver: string;
  s3Url: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceStatus = "pending" | "approved" | "rejected" | "failed";
// UPDATED: This type now matches the fields returned by the GET /api/v1/invoice/invoices endpoint.
export type InvoiceListItem = {
  // FIX: Changed 'id' from string to number to match the backend data
  id: number; 
  userId: number;
  invoiceNumber: string;
  totalAmount: string; 
  attachmentId: number;
  attachmentUrl: string;
  createdAt: string;
  vendorName?: string; 
  status: InvoiceStatus | null;
};


// UPDATED: This interface now matches the flat structure of your 'invoiceModel' in the database.
export interface InvoiceDetails {
  id: number;
  userId: number;
  attachmentId: number;
  invoiceNumber: string;
  vendorName: string | null;
  customerName: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  totalAmount: string | null; // numeric
  currency: string | null;
  // The 'lineItems' array has been replaced with the flat fields from your model
  lineItems: string | null; // numeric
  costCode: string | null;
  quantity: string | null; // numeric
  rate: string | null; // numeric
  description: string | null;
  createdAt: string;
  updatedAt: string;
  // These fields are needed by the viewer component but are not in the current backend model
  invoiceUrl: string;
  sourcePdfUrl: string;
  status: InvoiceStatus | null
}

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  // Add other fields as needed
}