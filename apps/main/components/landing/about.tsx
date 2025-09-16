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
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
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
              Revolutionizing{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AP Automation
              </span>{" "}
              Through AI
            </h2>

            <p className="text-xl text-gray-600 mb-6 leading-8">
              We're on a mission to revolutionize accounts payable automation
              through intelligent technology. Our AI-powered platform helps
              businesses of all sizes streamline their financial operations,
              reduce errors, and gain valuable insights into their spending
              patterns.
            </p>

            <p className="text-xl text-gray-600 mb-8 leading-8">
              Founded by a team of finance and technology experts, Payables.ai
              combines cutting-edge machine learning with deep industry
              knowledge to deliver a solution that actually works for real-world
              AP challenges.
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

            {/* AI Expertise Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI-Powered Technology
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Leveraging cutting-edge machine learning for intelligent
                    invoice processing
                  </p>
                </div>
                <div className="ml-auto">
                  <Sparkles className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 p-8 rounded-2xl border border-blue-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              To transform accounts payable from a cost center into a strategic
              function through intelligent automation, actionable insights, and
              seamless integration with existing business systems.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
