"use client";

import { motion } from "framer-motion";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { 
  Calendar, 
  FileText, 
  Receipt, 
  Zap,
  Clock,
} from "lucide-react";
import { PulsingOrb, GeometricPattern } from "./animated-icons";

export function ComingSoon() {
  const upcomingFeatures = [
    {
      title: "Invoice Releases",
      description: "Track invoice release schedules and ensure funds go out on time.",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "In Development"
    },
    {
      title: "Statements",
      description: "Generate vendor statements and project-level summaries for clear, organized reporting.",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "Coming Soon"
    },
    {
      title: "Receipts",
      description: "Automatically capture, match, and store receipts alongside invoices for complete financial records.",
      icon: Receipt,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      status: "Planned"
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background elements */}
      <GeometricPattern />
      <div className="absolute top-20 right-10 opacity-10">
        <PulsingOrb color="#3B82F6" size={120} />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <PulsingOrb color="#10B981" size={100} />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-sm font-medium border-purple-200 bg-purple-50/50 text-purple-700"
          >
            Coming Soon
          </Badge>
          
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Expanding Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              AP Workflow
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're building powerful new features to make accounts payable even more efficient and comprehensive for your business.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-full shadow-lg"
          >
            <Zap className="h-5 w-5 mr-2" />
            <span>Exciting New Features in Development</span>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {upcomingFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full dark:bg-white/80 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={`text-xs font-medium ${
                    feature.status === "In Development" ? "bg-blue-100 text-blue-700" :
                    feature.status === "Coming Soon" ? "bg-purple-100 text-purple-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {feature.status}
                  </Badge>
                </div>
                
                {/* Feature icon */}
                <div className="flex items-center mb-6">
                  <div className={`flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-lg ${feature.bgColor}`}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </motion.div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                {/* Progress indicator */}
                {/* <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full ${
                      feature.status === "In Development" ? "bg-blue-600 w-3/4" :
                      feature.status === "Coming Soon" ? "bg-purple-600 w-1/2" :
                      "bg-emerald-600 w-1/4"
                    }`}
                  ></div>
                </div> */}
                
                {/* <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {feature.status === "In Development" ? "Expected Q2 2025" :
                     feature.status === "Coming Soon" ? "Expected Q3 2025" :
                     "Planning Phase"}
                  </span>
                </div> */}
              </Card>
            </motion.div>
          ))}
        </div>

       
      
      </div>
    </section>
  );
}