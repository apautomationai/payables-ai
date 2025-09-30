"use client";

import React from "react";
import Link from "next/link";
import { Attachment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

interface InvoiceListProps {
  attachments: Attachment[];
  selectedAttachment: Attachment | null;
  onSelectAttachment: (attachment: Attachment) => void;
}

export default function InvoiceList({
  attachments,
  selectedAttachment,
  onSelectAttachment,
}: InvoiceListProps) {
  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Invoices</CardTitle>
          <Link href="/invoice-review" passHref>
            <Button variant="link" className="p-0 h-auto text-sm">
              View all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="divide-y divide-border/40">
            {attachments.slice(0, 10).map((attachment) => (
              <div
                key={attachment.id}
                onClick={() => onSelectAttachment(attachment)}
                className={cn(
                  "flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedAttachment?.id === attachment.id && "bg-muted"
                )}
              >
                <p className="font-semibold text-primary font-mono text-sm">
                  {attachment.id.substring(0, 8)}
                </p>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-none text-xs font-semibold"
                >
                  Pending
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}