"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

export default function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">
            {message} -{" "}
            <Link href="/integrations" className="font-medium underline hover:text-red-600">
              Go to Integrations
            </Link>
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

