import { InvoiceListItem, InvoiceDetails } from "../lib/types/invoice";

// Raw data based on the new structure provided
const rawInvoices: InvoiceDetails[] = [
  {
    id: "inv-001",
    userId: "user-001",
    invoiceNumber: "2024-5892",
    description: "Cloud Hosting Services - Pro Plan",
    costCode: "12345",
    vendorName: "Tech Solutions Inc.",
    customerName: "Innovate Corp.",
    invoiceDate: "2024-08-15",
    dueDate: "2024-09-14",
    totalAmount: 4500.0,
    currency: "USD",
    status: "Completed",
    lineItems: [
      {
        id: "li-01",
        description: "Cloud Hosting Services - Pro Plan",
        quantity: 1,
        unitPrice: 3000.0,
        total: 3000.0,
      },
      {
        id: "li-02",
        description: "Premium Support Package",
        quantity: 1,
        unitPrice: 1500.0,
        total: 1500.0,
      },
    ],
    pdfUrl: "/path/to/demo-invoice-1.pdf",
  },
  {
    id: "inv-002",
    userId: "user-002",
    invoiceNumber: "B-2024-034",
    description: "Office Supplies Co.",
    costCode: "12345",
    vendorName: "Office Supplies Co.",
    customerName: "Innovate Corp.",
    invoiceDate: "2024-08-20",
    dueDate: "2024-09-19",
    totalAmount: 375.5,
    currency: "USD",
    status: "Pending",
    lineItems: [
      {
        id: "li-03",
        description: "A4 Paper Ream (Case of 10)",
        quantity: 5,
        unitPrice: 50.0,
        total: 250.0,
      },
      {
        id: "li-04",
        description: "Black Ballpoint Pens (Box of 100)",
        quantity: 1,
        unitPrice: 75.5,
        total: 75.5,
      },
      {
        id: "li-05",
        description: "Stapler & Staples Set",
        quantity: 2,
        unitPrice: 25.0,
        total: 50.0,
      },
    ],
    pdfUrl: "/path/to/demo-invoice-2.pdf",
  },
  {
    id: "inv-003",
    userId: "user-003",
    invoiceNumber: "INV-781-C",
    description: "Website Redesign Project - Final Milestone",
    costCode: "12345",
    vendorName: "Creative Designs Ltd.",
    customerName: "Innovate Corp.",
    invoiceDate: "2024-08-22",
    dueDate: "2024-09-05",
    totalAmount: 12500.0,
    currency: "USD",
    status: "Requires Attention",
    lineItems: [
      {
        id: "li-06",
        description: "Website Redesign Project - Final Milestone",
        quantity: 1,
        unitPrice: 12500.0,
        total: 12500.0,
      },
    ],
    pdfUrl: "/path/to/demo-invoice-3.pdf",
  },
];

// Transformed data for the invoice list component
export const mockInvoices: InvoiceListItem[] = rawInvoices.map((invoice) => ({
  id: invoice.id,
  number: invoice.invoiceNumber,
  status: invoice.status,
  date: invoice.invoiceDate,
}));

// Transformed data for the invoice details component
export const mockInvoiceDetails: Record<string, InvoiceDetails> =
  rawInvoices.reduce(
    (acc, invoice) => {
      acc[invoice.id] = invoice;
      return acc;
    },
    {} as Record<string, InvoiceDetails>
  );
