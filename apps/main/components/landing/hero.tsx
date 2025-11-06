"use client";
import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  AnimatedRocket,
  AnimatedChart,
  PulsingOrb,
  FloatingElements,
  // GeometricPattern,
  ProfessionalIcons,
} from "./animated-icons";
import {
  ArrowRight,
  Play,
  // Star,
  // Users,
  // TrendingUp,
  // Shield,
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
    <section className="relative overflow-hidden pt-16 pb-32 sm:pt-24 sm:pb-40 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 via-transparent to-orange-900/10 opacity-60" />
        
        {/* Diamond plate texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 1px, transparent 0, transparent 50%),
                           repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 1px, transparent 0, transparent 50%)`,
          backgroundSize: '10px 10px'
        }} />

        {/* Professional floating elements */}
        <FloatingElements />
        <ProfessionalIcons />

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <PulsingOrb color="#FDB022" size={80} />
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <PulsingOrb color="#F59E0B" size={120} />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-25">
          <PulsingOrb color="#FF6B35" size={60} />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-amber-500 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-blob animation-delay-4000" />
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
            className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl uppercase"
          >
            AI-Powered
            <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Accounts Payable{" "}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-xl leading-8 text-gray-300 max-w-3xl mx-auto font-medium"
          >
            Sledge automates invoices, releases, and approvals — built tough for contractors, subs, and crews that move fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isLoggedIn ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-100 border-2 border-yellow-500 hover:border-yellow-400 transition-all duration-300 group shadow-lg shadow-yellow-500/20"
              >
                <Link href="#demo">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  WATCH PRODUCT DEMO
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 hover:from-yellow-400 hover:via-yellow-300 hover:to-amber-400 text-gray-900 px-8 py-4 text-lg font-bold rounded-lg shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-400/60 transition-all duration-300 group uppercase border-2 border-yellow-600"
                >
                  <Link href="/sign-up">
                    START FREE TRIAL
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-medium rounded-lg text-white bg-transparent hover:bg-gray-800 border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 group uppercase"
                >
                  <Link href="#demo">
                    <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    WATCH PRODUCT DEMO
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* <motion.div
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
          </motion.div> */}
        </div>

        {/* Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 mx-auto max-w-6xl"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

            {/* Floating animated elements around the preview */}
            <div className="absolute -top-20 -left-8 z-20">
              <AnimatedRocket />
            </div>
            <div className="absolute -bottom-5 -right-20 z-20">
              <AnimatedChart />
            </div>

            <div className="relative rounded-lg bg-gray-800/50 backdrop-blur-sm border-4 border-yellow-600/30 shadow-2xl shadow-yellow-500/20 p-4 sm:p-3">
              {/* Corner screws/rivets */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-600 z-20"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-600 z-20"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-600 z-20"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-600 z-20"></div>
              
              <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center sm:p-8 border-2 border-gray-700">
                {/* Floating orbs inside the demo area */}
                <div className="absolute top-4 left-4">
                  <PulsingOrb color="#FDB022" size={30} />
                </div>
                <div className="absolute bottom-4 right-4">
                  <PulsingOrb color="#F59E0B" size={25} />
                </div>
                <div className="relative rounded-lg shadow-2xl overflow-hidden border-2 border-yellow-600/20">
                  <Image
                    src="/images/dashboard.png"
                    alt="SLEDGE Product Screenshot"
                    width={1200}
                    height={900}
                    className="w-auto h-auto rounded-lg"
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
