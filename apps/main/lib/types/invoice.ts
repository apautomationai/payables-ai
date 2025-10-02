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



export type InvoiceListItem = {
  id: string;
  number: string;
  status: "Completed" | "Pending" | "Requires Attention";
  date: string;
};

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceDetails {
  id: string;
  userId: string;
  invoiceNumber: string;
  description: string;
  costCode: string;
  vendorName: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  status: "Completed" | "Pending" | "Requires Attention";
  lineItems: LineItem[];
  pdfUrl: string;
}
