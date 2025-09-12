import React from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { FileText, ArrowRight } from "lucide-react";

export default function RootHomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-2xl px-4">
        <div className="p-4 bg-primary/10 rounded-full border-2 border-primary/20">
          <FileText className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Welcome to Payable.ai
        </h1>
        <p className="text-lg text-muted-foreground">
          Transforming Invoices into Actionable Data with AI. Streamline your
          workflow, eliminate manual entry, and gain valuable insights
          effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/dashboard" passHref>
            <Button size="lg" className="w-full sm:w-auto">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/sign-in" passHref>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
