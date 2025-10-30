

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { DollarSign, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { InvoiceListItem } from "@/lib/types";

interface StatsCardsProps {
  invoices: InvoiceListItem[];
}

export default function StatsCards({ invoices }: StatsCardsProps) {
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const invoicesThisMonth = safeInvoices.filter(inv => {
    if (!inv.createdAt) return false;
    const invoiceDate = new Date(inv.createdAt);
    const today = new Date();
    return invoiceDate.getMonth() === today.getMonth() &&
           invoiceDate.getFullYear() === today.getFullYear();
  }).length;

  const pendingReviewCount = safeInvoices.filter(inv => inv.status === 'pending').length;

  const stats = [
    { title: "Total Outstanding", value: "$0.00", description: "Pending invoices value", icon: DollarSign },
    { title: "Invoices This Month", value: invoicesThisMonth.toString(), description: "Total processed", icon: FileText },
    { title: "Pending Review", value: pendingReviewCount.toString(), description: "Awaiting approval", icon: Clock },
    { title: "Approved Today", value: "0", description: "Successfully processed", icon: CheckCircle },
    { title: "Rejected Invoices", value: "0", description: "Requires attention", icon: XCircle },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}