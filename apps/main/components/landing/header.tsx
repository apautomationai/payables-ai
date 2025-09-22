"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Menu, X, CreditCard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { checkSession } from "./action";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "About", href: "#about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const verifySession = async () => {
      const { isLoggedIn } = await checkSession();
      setIsLoggedIn(isLoggedIn);
    };
    verifySession();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll and manage z-index conflicts
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [mobileMenuOpen]);

  const AuthButtons = () =>
    isLoggedIn ? (
      <Button
        asChild
        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <Link href={"/dashboard"}>
          Go To Dashboard
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </Button>
    ) : (
      <>
        <Button
          asChild
          variant="ghost"
          className="text-gray-700 hover:text-blue-600 font-medium dark:hover:bg-gray-50 transition-colors duration-300"
        >
          <Link href={"/sign-in"}>Sign In</Link>
        </Button>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <Link href={"/sign-up"}>
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </>
    );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Payable.ai
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex lg:items-center lg:gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex lg:items-center lg:gap-4">
              <AuthButtons />
            </div>

            <div className="flex lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 z-50 relative"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Rendered outside the header to avoid z-index conflicts */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* High z-index overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
            </motion.div>
            
            {/* Mobile menu panel with highest z-index */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                  <Link 
                    href="/" 
                    className="flex items-center gap-3" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">
                      Payable.ai
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="px-6 space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block rounded-lg px-4 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Auth Buttons */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="space-y-3">
                    <AuthButtons />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}