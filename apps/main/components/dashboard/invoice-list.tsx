"use client";

import React from "react";
import Link from "next/link";
import { Attachment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { FileText, Mail } from "lucide-react"; // Import icons

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
  const safeAttachments = Array.isArray(attachments) ? attachments : [];

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm">
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
            {safeAttachments.length > 0 ? (
              safeAttachments.slice(0, 10).map((attachment) => (
                <div
                  key={attachment.id}
                  onClick={() => onSelectAttachment(attachment)}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedAttachment?.id === attachment.id && "bg-muted"
                  )}
                >
                  {/* --- MODIFICATION: Display more useful info --- */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="flex items-center gap-2 text-sm font-semibold text-primary truncate">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{attachment.filename}</span>
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-none text-xs font-semibold"
                    >
                      Pending
                    </Badge>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">From: {attachment.sender}</span>
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <p>No invoices found.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}