export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
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
  invoiceNumber: string;
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
