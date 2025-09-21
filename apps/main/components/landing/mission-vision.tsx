"use client";

import { motion } from "framer-motion";
import { Card } from "@workspace/ui/components/card";
import { 
  Target, 
  Eye, 
  Heart, 
  Sparkles, 
  Clock,
  Zap,
  Building2,
  ArrowRight
} from "lucide-react";
import { PulsingOrb, AnimatedRocket, AnimatedWorkflow } from "./animated-icons";

export function MissionVision() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <PulsingOrb color="#3B82F6" size={120} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <PulsingOrb color="#8B5CF6" size={100} />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-200/20 rounded-full blur-xl"></div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-2xl inline-block mb-6">
              <div className="bg-white p-2 rounded-xl">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mission
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 mb-8 leading-8">
              To take the headache out of accounts payable by giving builders, contractors, and small businesses the tools to manage invoices effortlessly, pay vendors on time, and keep every project moving forward.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Effortless Management</h3>
                  <p className="text-gray-600">Streamline your invoice processes</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Timely Payments</h3>
                  <p className="text-gray-600">Never miss a vendor payment again</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Project Continuity</h3>
                  <p className="text-gray-600">Keep your projects moving forward</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Animated workflow illustration */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl border border-blue-200">
              <div className="flex justify-center mb-6">
                <AnimatedWorkflow />
              </div>
              
              {/* Stats overlay */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">90%</div>
                  <div className="text-sm text-gray-600">Faster Processing</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">99%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600">24/7</div>
                  <div className="text-sm text-gray-600">Availability</div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4"
            >
              <div className="bg-white p-2 rounded-full shadow-lg border border-blue-100">
                <Heart className="h-5 w-5 text-pink-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            {/* Animated rocket illustration */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl border border-purple-200">
              <div className="flex justify-center mb-6">
                <AnimatedRocket />
              </div>
              
              {/* Future-focused elements */}
              <div className="flex justify-center space-x-4 mt-6">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-purple-100">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-600">Efficiency</div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-purple-100">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-600">Innovation</div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-purple-100">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-purple-400 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-600">Growth</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-4 -left-4"
            >
              <div className="bg-white p-2 rounded-full shadow-lg border border-purple-100">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-200/20 rounded-full blur-xl"></div>
            
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl inline-block mb-6">
              <div className="bg-white p-2 rounded-xl">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vision
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 mb-8 leading-8">
              A world where no business loses time, money, or opportunities because of messy invoice processes. We're building the future of accounts payable — faster, smarter, and built for the trades.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Future-Forward</h3>
                  <p className="text-gray-600">Building the next generation of AP tools</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-pink-100">
                  <Zap className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Industry-Specific</h3>
                  <p className="text-gray-600">Solutions built for the trades</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Zero Compromise</h3>
                  <p className="text-gray-600">Eliminating time and money loss</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
       
      </div>
    </section>
  );
}