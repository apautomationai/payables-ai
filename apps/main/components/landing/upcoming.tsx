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
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      status: "In Development"
    },
    {
      title: "Statements",
      description: "Generate vendor statements and project-level summaries for clear, organized reporting.",
      icon: FileText,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      status: "Coming Soon"
    },
    {
      title: "Receipts",
      description: "Automatically capture, match, and store receipts alongside invoices for complete financial records.",
      icon: Receipt,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      status: "Planned"
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden border-y-4 border-yellow-600/20">
      {/* Background elements */}
      <GeometricPattern />
      
      {/* Diamond plate texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 1px, transparent 0, transparent 50%),
                         repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 1px, transparent 0, transparent 50%)`,
        backgroundSize: '12px 12px'
      }} />
      
      {/* Golden glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      
      <div className="absolute top-20 right-10 opacity-10">
        <PulsingOrb color="#FDB022" size={120} />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <PulsingOrb color="#F59E0B" size={100} />
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
            className="mb-4 px-3 py-1 text-sm font-medium border-yellow-600 bg-yellow-500/20 text-yellow-400 uppercase"
          >
            Coming Soon
          </Badge>
          
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 uppercase">
            Expanding Your{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              AP Workflow
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Drive productivity across project management, payments, and more with seamless integrations.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 rounded-lg shadow-lg shadow-yellow-500/30 font-bold uppercase"
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
              <Card className="p-6 h-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 hover:border-yellow-600/50 shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 group relative overflow-hidden">
                {/* Corner screws/rivets */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
                
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={`text-xs font-medium uppercase ${
                    feature.status === "In Development" ? "bg-yellow-500/20 text-yellow-400 border-yellow-600" :
                    feature.status === "Coming Soon" ? "bg-orange-500/20 text-orange-400 border-orange-600" :
                    "bg-amber-500/20 text-amber-400 border-amber-600"
                  }`}>
                    {feature.status}
                  </Badge>
                </div>
                
                {/* Feature icon */}
                <div className="flex items-center mb-6">
                  <div className={`flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-lg ${feature.bgColor} border-2 border-yellow-600/40 group-hover:border-yellow-500 transition-all`}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </motion.div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 uppercase group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                
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