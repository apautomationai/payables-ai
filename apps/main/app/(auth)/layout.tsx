import { FileText } from "lucide-react";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-100">
        {children}
      </div>
      <div className="hidden bg-zinc-900 lg:flex flex-col items-center justify-center p-10 text-center relative text-white">
        <div className="relative z-10">
          <FileText className="mx-auto h-20 w-20 text-gray-400" />
          <h1 className="mt-8 text-4xl font-bold tracking-tight">
            Streamline Your Invoicing
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            Join Payable.ai and turn complex PDFs into actionable data
            effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
