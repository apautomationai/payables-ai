
"use client";

import { FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import {
  FloatingElements,
  GeometricPattern,
} from "@/components/landing/animated-icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-gray-800">
      {/* Diamond plate texture - ROUGHER */}
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px),
                         repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px)`,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Grunge overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `radial-gradient(ellipse at 30% 40%, transparent 30%, rgba(253, 176, 34, 0.15) 31%, transparent 32%)`,
        backgroundSize: '300px 300px'
      }} />
      
      {/* Background Elements */}
      <GeometricPattern />
      <FloatingElements />

      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 via-transparent to-orange-900/10 opacity-60" />

      {/* Left Side - Form Area */}
      <div className="flex flex-col gap-4 p-6 md:p-10 relative z-10">
        {/* Logo/Branding */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-gray-900 flex size-6 items-center justify-center rounded-none border-2 border-yellow-600/60 shadow-[0_0_10px_rgba(253,176,34,0.3)]">
                <FileText className="size-4" />
              </div>
              {/* Corner screws */}
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gray-800 rounded-full border border-gray-600"></div>
              <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-gray-800 rounded-full border border-gray-600"></div>
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-gray-800 rounded-full border border-gray-600"></div>
              <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-gray-800 rounded-full border border-gray-600"></div>
            </div>
            <span className="text-white font-bold uppercase">SLEDGE</span>
          </Link>
        </div>

        {/* Form Container - Centered */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>

      {/* Right Side - Promotional Content */}
      <div className="bg-gradient-to-br from-gray-900 to-black relative hidden lg:block overflow-hidden">
        {/* Diamond plate texture overlay */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px),
                           repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center p-12 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto lg:mx-0"
          >
            {/* Logo/Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-none flex items-center justify-center shadow-[0_0_30px_rgba(253,176,34,0.5),inset_0_0_20px_rgba(0,0,0,0.5)] border-4 border-yellow-600/60">
                  <FileText className="h-10 w-10 text-gray-900" />
                </div>
                {/* Corner screws */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6 uppercase"
            >
              Streamline Your Invoicing
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Join Sledge and turn complex PDFs into actionable data effortlessly.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-3 mb-8"
            >
              {[
                "AI-powered invoice processing",
                "Real-time data extraction",
                "Secure cloud storage",
                "Multi-user collaboration"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 text-gray-300"
                >
                  <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm lg:text-base">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}




