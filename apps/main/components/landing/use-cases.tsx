"use client";

import { motion } from "framer-motion";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import {
  Building,
  HardHat,
  Paintbrush,
  Construction,
  Trees,
  Store,
  Clock,
  Zap,
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
    category: "General Contractors",
    icon: Building,
    description: "Handle invoices from multiple subs and suppliers, keep project costs organized, and pay out directly.",
    highlights: [
      "Multiple subcontractor invoices",
      "Project cost organization",
      "Direct payment processing",
    ],
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    category: "Specialty Trades",
    icon: HardHat,
    description: "Electricians, plumbers, roofers, HVAC, framers, and carpenters — track supplier invoices and tie costs to specific jobs.",
    highlights: [
      "Trade-specific invoicing",
      "Job cost tracking",
      "Supplier management",
    ],
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    category: "Finishing & Interiors",
    icon: Paintbrush,
    description: "Drywall crews, painters, flooring installers, cabinet makers, and glaziers — keep material and labor invoices clean and project-ready.",
    highlights: [
      "Material & labor invoices",
      "Project-ready documentation",
      "Clean record keeping",
    ],
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    category: "Heavy Work & Site Prep",
    icon: Construction,
    description: "Concrete, masonry, excavation, dirt work, welders, demolition, and paving contractors — log big-ticket invoices for equipment, materials, and crews.",
    highlights: [
      "Big-ticket invoice management",
      "Equipment & material tracking",
      "Crew cost documentation",
    ],
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    category: "Outdoor & Custom Builds",
    icon: Trees,
    description: "Landscapers, pool and spa installers, and outdoor contractors — manage recurring supplier invoices and job-specific costs.",
    highlights: [
      "Recurring supplier invoices",
      "Job-specific cost tracking",
      "Outdoor project management",
    ],
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    category: "Shops & Small Businesses",
    icon: Store,
    description: "Millwork shops, smoke shops, nail salons, and other small businesses that run on supplier invoices — simplify recordkeeping and payouts.",
    highlights: [
      "Supplier invoice simplification",
      "Streamlined recordkeeping",
      "Easy payout processing",
    ],
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
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
    <section
      id="use-cases"
      className="py-24 sm:py-32 bg-gradient-to-b from-gray-800 via-gray-900 to-black relative overflow-hidden"
    >
      {/* Background elements */}
      <GeometricPattern />
      <FloatingElements />
      <ProfessionalIcons />
      
      {/* Diamond plate texture - ROUGHER */}
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px),
                         repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px)`,
        backgroundSize: '40px 40px'
      }} />

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
            className="mb-4 px-3 py-1 text-sm font-medium border-yellow-600 bg-yellow-500/20 text-yellow-400 uppercase"
          >
            Use Cases
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl uppercase">
            See how businesses are transforming their <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              AP Processes
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-300">
            Discover how different industries leverage our solution to automate
            accounts payable and achieve remarkable efficiency gains.
          </p>
        </motion.div>

        {/* Use Cases Grid with Lucide Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full border-8 border-gray-600 hover:border-yellow-600/70 shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(253,176,34,0.5),inset_0_0_30px_rgba(0,0,0,0.6)] transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-none">
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
                <h3 className="text-xl font-semibold text-white ml-4 mt-1 uppercase">
                  {useCase.category}
                </h3>
              </div>

              <p className="text-gray-300 mb-6">{useCase.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
