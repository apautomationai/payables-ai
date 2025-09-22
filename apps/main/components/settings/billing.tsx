"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { CreditCard, Download } from "lucide-react";

// Mock data for billing history
const billingHistory = [
  {
    invoiceId: "INV-2025-003",
    date: "September 1, 2025",
    amount: "$99.00",
    status: "Paid",
  },
  {
    invoiceId: "INV-2025-002",
    date: "August 1, 2025",
    amount: "$99.00",
    status: "Paid",
  },
  {
    invoiceId: "INV-2025-001",
    date: "July 1, 2025",
    amount: "$99.00",
    status: "Paid",
  },
];

export default function BillingTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the Pro Plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-lg border p-4">
            <div>
              <h3 className="text-lg font-semibold">Pro Plan</h3>
              <p className="text-muted-foreground">$99.00 per month</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your next payment is scheduled for October 1, 2025.
              </p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your saved payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-semibold">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2028</p>
              </div>
            </div>
            <Button variant="outline">Update Payment Method</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.invoiceId}>
                  <TableCell className="font-medium">
                    {invoice.invoiceId}
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "default" : "secondary"} className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
