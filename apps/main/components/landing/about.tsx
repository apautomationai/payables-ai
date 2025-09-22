"use client";

import { motion } from "framer-motion";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import {
  FileText,
  Target,
  Users,
  Brain,
  ArrowRight,
  Sparkles,
  Eye,
} from "lucide-react";
import { PulsingOrb } from "./animated-icons";
import Image from "next/image";

export function About() {
  const stats = [
    {
      value: "10,000+",
      label: "Invoices Processed",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      value: "98%",
      label: "Accuracy Rate",
      icon: Target,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      value: "500+",
      label: "Happy Customers",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 sm:py-32 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 opacity-10">
        <PulsingOrb color="#3B82F6" size={120} />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <PulsingOrb color="#10B981" size={100} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-3 py-1 text-sm font-medium border-blue-200 bg-blue-50/50 text-blue-700"
            >
              About Payables.ai
            </Badge>

            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Why We Built{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Payables
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-6 leading-8">
              We've all been there — chasing down invoices, juggling emails, and trying to keep projects moving while paperwork slows everything down. In construction and small business especially, missed invoices or late payments can kill cash flow and damage relationships. We built Payables because we were tired of watching businesses lose time and money on something that should be simple.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Learn More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Right column - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Image
              src={"/images/Payables.png"}
              alt="Payables.ai"
              height={500}
              width={500}
              className="w-full h-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-200"
            />

            {/* Mission and Vision Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-1 gap-6"
            >
              {/* Mission Card */}
              <Card className="p-6 dark:border-blue-100 border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Our Mission
                    </h3>
                    <p className="text-gray-600 text-sm leading-6">
                      To take the headache out of accounts payable by giving builders, contractors, and small businesses the tools to manage invoices effortlessly, pay vendors on time, and keep every project moving forward.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Vision Card */}
              <Card className="p-6 dark:border-purple-100 border-purple-100 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Our Vision
                    </h3>
                    <p className="text-gray-600 text-sm leading-6">
                      A world where no business loses time, money, or opportunities because of messy invoice processes. We're building the future of accounts payable — faster, smarter, and built for the trades.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}