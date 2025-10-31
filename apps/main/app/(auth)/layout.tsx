
"use client";

import { FileText, Zap, Shield, Users, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Large Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl"></div>

        {/* Floating Animated Elements */}
        <motion.div
          className="absolute top-20 left-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-40 right-32"
          animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="relative">
            <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="absolute -inset-1 bg-yellow-400/20 rounded-2xl blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-32"
          animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div className="absolute -inset-1 bg-green-400/20 rounded-2xl blur-sm"></div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-20"
          animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="absolute -inset-1 bg-cyan-400/20 rounded-2xl blur-sm"></div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Promotional Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left hidden lg:block"
            >
              {/* Logo/Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center mb-8"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 border-2 border-blue-400/30 rounded-2xl"
                  ></motion.div>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6"
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
                    <Sparkles className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm lg:text-base">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 group"
              >
                <Link href="/" className="font-medium">Learn More</Link>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div> */}
            </motion.div>

            {/* Right Side - Login Form with Glowing Dot Spline */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md">

                {/* Main Card Container */}
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
                  {children}
                </div>
              </div>
            </motion.div>


          </div>
        </div>
      </div>
    </div>
  );
}




