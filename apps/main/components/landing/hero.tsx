"use client";
import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  AnimatedRocket,
  AnimatedChart,
  PulsingOrb,
  FloatingElements,
  GeometricPattern,
  ProfessionalIcons,
} from "./animated-icons";
import {
  ArrowRight,
  Play,
  Star,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { checkSession } from "./action";
import Link from "next/link";

export function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const { isLoggedIn } = await checkSession();
      setIsLoggedIn(isLoggedIn);
    };
    verifySession();
  }, []);
  return (
    <section className="relative overflow-hidden pt-16 pb-32 sm:pt-24 sm:pb-40">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 opacity-60" />

        {/* Professional floating elements */}
        <FloatingElements />
        <ProfessionalIcons />

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <PulsingOrb color="#3B82F6" size={80} />
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <PulsingOrb color="#10B981" size={120} />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-25">
          <PulsingOrb color="#8B5CF6" size={60} />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm font-medium border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/50 transition-all duration-300"
            >
              <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
              Trusted by 10,000+ businesses worldwide
            </Badge>
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl"
          >
            AI-Powered
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Accounts Payable{" "}
            </span>
        
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-xl leading-8 text-gray-600 max-w-3xl mx-auto"
          >
           Stop wasting time on manual invoice handling. Automatically capture, track, and pay your invoices — all in one streamlined platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isLoggedIn ? (
              // <Button
              //   asChild
              //   variant="outline"
              //   size="lg"
              //   className="px-8 py-4 text-lg font-medium rounded-xl text-black hover:text-black dark:bg-white dark:hover:bg-gray-50 border-gray-300 dark:border-gray-300 hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-300 group"
              // >
              //   <Link href="#demo">
              //     <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              //     Watch Demo Video
              //   </Link>
              // </Button>
              <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 from-10% via-sky-600 via-30% to-emerald-500 to-90% hover:from-blue-700 not-[]:hover:via-sky-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/sign-up">
              Try for Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 from-10% via-sky-600 via-30% to-emerald-500 to-90% hover:from-blue-700 not-[]:hover:via-sky-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href="/sign-up">
                  Try for Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                {/* <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-medium rounded-xl text-black hover:text-black dark:bg-white dark:hover:bg-gray-50 border-gray-300 dark:border-gray-300 hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-300 group"
                >
                  <Link href="#demo">
                    <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Watch Demo Video
                  </Link>
                </Button> */}
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Enterprise Security</span>
            </div>
          </motion.div>
        </div>

        {/* Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 mx-auto max-w-6xl"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-300/50 via-transparent to-transparent z-10 " />

            {/* Floating animated elements around the preview */}
            <div className="absolute -top-20 -left-8 z-20">
              <AnimatedRocket />
            </div>
            <div className="absolute -bottom-5 -right-20 z-20">
              <AnimatedChart />
            </div>

            <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-2xl p-4 sm:p-3">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center sm:p-8">
                {/* Floating orbs inside the demo area */}
                <div className="absolute top-4 left-4">
                  <PulsingOrb color="#3B82F6" size={30} />
                </div>
                <div className="absolute bottom-4 right-4">
                  <PulsingOrb color="#10B981" size={25} />
                </div>
                <div className="relative rounded-lg shadow-2xl overflow-hidden">
                  <Image
                    src="/images/dashboard.png"
                    alt="Payables.ai Product Screenshot"
                    width={1200}
                    height={900}
                    className="w-auto h-auto border border-gray-200 rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
