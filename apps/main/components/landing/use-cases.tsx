"use client";

import { motion } from "framer-motion";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import {
  Building2,
  School,
  Factory,
  HeartPulse,
  Zap,
  Clock,
  BarChart3,
  Shield,
} from "lucide-react";
import {
  AnimatedLightning,
  AnimatedClock,
  AnimatedChart,
  AnimatedShield,
  FloatingElements,
  ProfessionalWave,
  GeometricPattern,
  ProfessionalIcons,
} from "./animated-icons";

const useCases = [
  {
    category: "Mid-Size Companies",
    icon: Building2,
    description:
      "Streamline invoice processing for growing businesses with 100-1000 monthly invoices. Reduce manual data entry by 90% and process invoices 5x faster.",
    highlights: [
      "100-1000 monthly invoices",
      "90% less manual data entry",
      "5x faster processing",
    ],
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    category: "Education",
    icon: School,
    description:
      "Manage vendor payments for educational institutions. Handle seasonal invoice spikes and maintain transparency in financial operations.",
    highlights: [
      "Educational institutions",
      "Seasonal invoice spikes",
      "Financial transparency",
    ],
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    category: "Manufacturing",
    icon: Factory,
    description:
      "Handle complex vendor relationships and high-volume invoice processing. Automate approval workflows and maintain compliance with industry standards.",
    highlights: [
      "Complex vendor relationships",
      "High-volume processing",
      "Industry compliance",
    ],
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    category: "Healthcare",
    icon: HeartPulse,
    description:
      "Ensure HIPAA compliance while processing medical invoices. Maintain accurate vendor records and streamline payment approvals for healthcare providers.",
    highlights: [
      "HIPAA compliance",
      "Medical invoices",
      "Healthcare providers",
    ],
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
];

const stats = [
  { value: "90%", label: "Reduction in manual data entry", icon: Zap },
  { value: "5x", label: "Faster invoice processing", icon: Clock },
  { value: "1000+", label: "Invoices processed monthly", icon: BarChart3 },
  { value: "100%", label: "Compliance adherence", icon: Shield },
];

export function UseCases() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <GeometricPattern />
      <FloatingElements />
      <ProfessionalIcons />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-sm font-medium border-blue-200 bg-blue-50/50 text-blue-700"
          >
            Use Cases
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            See how businesses are transforming their <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AP Processes
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Discover how different industries leverage our solution to automate
            accounts payable and achieve remarkable efficiency gains.
          </p>
        </motion.div>

        {/* Use Cases Grid with Lucide Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden dark:bg-white/80 bg-white/80 backdrop-blur-sm dark:border-gray-200 border-gray-200">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 ${useCase.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="flex items-start mb-6">
                  <div
                    className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg ${useCase.bgColor}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <useCase.icon
                        className={`h-6 w-6 ${useCase.iconColor}`}
                      />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4 mt-1">
                    {useCase.category}
                  </h3>
                </div>

                <p className="text-gray-600 mb-6">{useCase.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
