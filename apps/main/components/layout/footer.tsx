import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 px-4 lg:px-6 py-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} Payable.ai. All rights reserved.
        </p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="/terms-conditions" target="_blank" className="hover:text-primary transition-colors">
            Terms and Conditions
          </Link>
          <Link
            href="/privacy-policy"
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact-us"
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
