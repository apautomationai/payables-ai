"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Plus, UploadCloud, ListFilter } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardClientProps {
  userName: string;
}

export default function DashboardClient({ userName }: DashboardClientProps) {
  // You can use the userId for any client-side operations

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <h1 className="text-xl font-semibold text-foreground">
          Accounts Payable Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ListFilter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" asChild>
            <Link href="/invoice-review">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content - Welcome Screen */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome to PayableAI, {userName}!
          </h2>
          <p className="mt-2 text-muted-foreground">
            You're all set up! Upload your first invoice to get started with
            automated invoice processing.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/invoice-review">
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Your First Invoice
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
