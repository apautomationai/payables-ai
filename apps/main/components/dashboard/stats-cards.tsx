import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { DollarSign, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Attachment } from "@/lib/types"; // Make sure this path is correct

interface StatsCardsProps {
  attachments: Attachment[];
}

export default function StatsCards({ attachments }: StatsCardsProps) {
  // Calculate the number of invoices created in the current month.
  const invoicesThisMonth = attachments.filter(att => {
    const attachmentDate = new Date(att.created_at);
    const today = new Date();
    return attachmentDate.getMonth() === today.getMonth() &&
           attachmentDate.getFullYear() === today.getFullYear();
  }).length;

  // The total number of attachments represents the pending review count.
  const pendingReviewCount = attachments.length;

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
        <Card key={index} className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
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

