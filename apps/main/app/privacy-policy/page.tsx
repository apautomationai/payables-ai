"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  FileText,
  UserCheck,
  Mail,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Search,
  Handshake,
  Brain,
  Info,
  Server,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  FloatingElements,
  GeometricPattern,
} from "@/components/landing/animated-icons";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const sections = [
    { id: "introduction", title: "Introduction", icon: FileText },
    {
      id: "information-collection",
      title: "Information Collect",
      icon: Database,
    },
    { id: "data-usage", title: "Use Information", icon: Info },
    { id: "data-sharing", title: "Share Information", icon: Users },
    { id: "data-retention", title: "Data Retention", icon: Calendar },
    { id: "data-security", title: "Data Security", icon: Shield },
    { id: "cookies", title: "Cookies & Tracking", icon: Eye },
    { id: "your-rights", title: "Rights & Choices", icon: UserCheck },
  ];

  // Set up intersection observer for auto-scroll navigation
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Adjusted for better trigger points
      threshold: 0,
    };

    sections.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (element) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          });
        }, observerOptions);

        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const setSectionRef = (element: HTMLElement | null, sectionId: string) => {
    sectionRefs.current[sectionId] = element;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Diamond plate texture - ROUGHER */}
        <div className="absolute inset-0 opacity-[0.1]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px),
                           repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Grunge overlay */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(ellipse at 30% 40%, transparent 30%, rgba(253, 176, 34, 0.15) 31%, transparent 32%)`,
          backgroundSize: '300px 300px'
        }} />
        
        {/* Background Elements */}
        <GeometricPattern />
        <FloatingElements />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-none flex items-center justify-center shadow-[0_0_30px_rgba(253,176,34,0.5),inset_0_0_20px_rgba(0,0,0,0.5)] border-4 border-yellow-600/60">
                  <Shield className="w-10 h-10 text-gray-900" />
                </div>
                {/* Corner screws */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-600"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <CheckCircle2 className="w-4 h-4 text-gray-900" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4 uppercase"
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Protecting your data is our top priority. Learn how DMR collects,
              uses, and protects your information.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-400"
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
                Last Updated: [Month Day, Year]
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Comprehensive Data Protection
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-yellow-500" />
                GDPR & CCPA Compliant
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-none shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] border-8 border-gray-600 p-6 sticky top-8 relative">
                {/* Corner screws/rivets */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                
                {/* Weld marks */}
                <div className="absolute top-4 left-1/4 w-16 h-1 bg-yellow-600/40 blur-[2px]"></div>
                
                <h3 className="font-semibold text-white mb-4 flex items-center uppercase">
                  <ArrowRight className="w-4 h-4 mr-2 text-yellow-500" />
                  Policy Sections
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-4 py-3 rounded-none transition-all duration-300 flex items-center group border-4 ${
                          activeSection === section.id
                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-600/70 shadow-[0_0_20px_rgba(253,176,34,0.3)]"
                            : "text-gray-400 hover:bg-gray-800 hover:text-yellow-400 border-gray-600 hover:border-yellow-600/50"
                        }`}
                        whileHover={{ x: 4 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <IconComponent
                          className={`w-5 h-5 mr-3 ${
                            activeSection === section.id
                              ? "text-yellow-500"
                              : "text-gray-500 group-hover:text-yellow-400"
                          }`}
                        />
                        {section.title}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t-4 border-yellow-600/30">
                  <h4 className="font-semibold text-white mb-3 uppercase">
                    Data Requests
                  </h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-4 border-yellow-600/50 hover:bg-yellow-500/20 hover:border-yellow-600 text-gray-300 hover:text-yellow-400 rounded-none font-medium uppercase"
                      onClick={() => scrollToSection("your-rights")}
                    >
                      <Mail className="w-4 h-4 mr-2 text-yellow-500" />
                      Contact Support
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-4 border-orange-600/50 hover:bg-orange-500/20 hover:border-orange-600 text-gray-300 hover:text-orange-400 rounded-none font-medium uppercase"
                      onClick={() => scrollToSection("your-rights")}
                    >
                      <Database className="w-4 h-4 mr-2 text-orange-500" />
                      Data Export
                    </Button>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 pt-4 border-t-4 border-yellow-600/30">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span className="uppercase">Progress</span>
                    <span className="font-medium text-yellow-400">
                      {Math.round(
                        ((sections.findIndex((s) => s.id === activeSection) +
                          1) /
                          sections.length) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-none h-3 border-2 border-gray-600">
                    <motion.div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-none shadow-[0_0_10px_rgba(253,176,34,0.5)]"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length) * 100}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="lg:col-span-3"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-none shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] border-8 border-gray-600 p-8 relative">
                {/* Corner screws/rivets */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                
                {/* Weld marks */}
                <div className="absolute top-6 left-1/4 w-20 h-1 bg-yellow-600/40 blur-[2px]"></div>
                <div className="absolute bottom-6 right-1/4 w-16 h-1 bg-yellow-600/40 blur-[2px]"></div>
                {/* Introduction */}
                <motion.section
                  ref={(el) => setSectionRef(el, "introduction")}
                  id="introduction"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">
                        Introduction
                      </h2>
                      <p className="text-yellow-400 font-medium uppercase">
                        DMR Privacy Policy
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-gray-300 mb-4">
                      This Privacy Policy describes how DMR, a Nevada
                      corporation (doing business as SLEDGE) ("DMR," "we,"
                      "our," or "us") collects, uses, discloses, and protects
                      your information when you use our website, web
                      application, and mobile application (collectively, the
                      "Service").
                    </p>
                    <p className="text-lg text-gray-300 mb-4">
                      By accessing or using the Service, you consent to this
                      Privacy Policy. If you do not agree, please discontinue
                      use of the Service.
                    </p>
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-none p-6 border-4 border-yellow-600/40 relative">
                      {/* Corner screws */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <h4 className="font-semibold text-white mb-3 flex items-center uppercase">
                        <Handshake className="w-6 h-6 mr-2 text-yellow-500" />
                        Our Commitment
                      </h4>
                      <p className="text-gray-300">
                        We are committed to protecting your privacy and being
                        transparent about how we handle your personal
                        information.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Information We Collect */}
                <motion.section
                  ref={(el) => setSectionRef(el, "information-collection")}
                  id="information-collection"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-none border-4 border-orange-600/40 flex items-center justify-center mr-4">
                      <Database className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">
                        Information We Collect
                      </h2>
                      <p className="text-orange-400 font-medium uppercase">
                        What We Collect & How We Protect It
                      </p>
                    </div>
                  </div>

                  <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                  >
                    <motion.div
                      variants={fadeInUp}
                      className="bg-yellow-500/10 rounded-none p-6 border-4 border-yellow-600/40 relative"
                    >
                      {/* Corner screws */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <h3 className="font-semibold text-white mb-3 flex items-center uppercase">
                        <Search className="w-5 h-5 mr-2 text-yellow-500" />
                        Information You Provide
                      </h3>
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          Account Information: name, email, phone, password,
                          business details
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          Authentication Data: Google or Microsoft sign-in
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          Billing Information: payment methods, billing address
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          Support Requests: messages, emails, forms
                        </li>
                      </ul>
                    </motion.div>

                    <motion.div
                      variants={fadeInUp}
                      className="bg-orange-500/10 rounded-none p-6 border-4 border-orange-600/40 relative"
                    >
                      {/* Corner screws */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <h3 className="font-semibold text-white mb-3 flex items-center uppercase">
                        <Shield className="w-5 h-5 mr-2 text-orange-500" />
                        Automatically Collected
                      </h3>
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          Device Information: IP, browser, OS, device
                          identifiers
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          Usage Data: pages visited, time spent, interactions
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          Cookies & Tracking: session IDs, analytics cookies
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          Third-party data: authentication providers, payment
                          processors
                        </li>
                      </ul>
                    </motion.div>
                  </motion.div>
                </motion.section>

                {/* How We Use Your Information */}
                <motion.section
                  ref={(el) => setSectionRef(el, "data-usage")}
                  id="data-usage"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <Info className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                      How We Use Your Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {[
                      {
                        icon: UserCheck,
                        title: "Account Management",
                        desc: "Create, verify, and maintain user accounts",
                        color: "blue",
                      },
                      {
                        icon: Server,
                        title: "Service Delivery",
                        desc: "Provide, personalize, and improve functionality",
                        color: "blue",
                      },
                      {
                        icon: FileText,
                        title: "Payments",
                        desc: "Process transactions, invoices, and billing",
                        color: "emerald",
                      },
                      {
                        icon: Mail,
                        title: "Communication",
                        desc: "Send updates, notices, and promotional content",
                        color: "emerald",
                      },
                      {
                        icon: Shield,
                        title: "Security",
                        desc: "Detect, prevent, and respond to security incidents",
                        color: "blue",
                      },
                      {
                        icon: Brain,
                        title: "Analytics & Improvement",
                        desc: "Monitor usage and improve performance",
                        color: "emerald",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`${
                          item.color === "blue" 
                            ? "bg-yellow-500/10 border-4 border-yellow-600/40" 
                            : "bg-orange-500/10 border-4 border-orange-600/40"
                        } rounded-none p-4 relative`}
                      >
                        {/* Corner screws */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                        <div
                          className={`w-10 h-10 ${
                            item.color === "blue"
                              ? "bg-yellow-500/20 border-2 border-yellow-600/40"
                              : "bg-orange-500/20 border-2 border-orange-600/40"
                          } rounded-none flex items-center justify-center mb-3`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              item.color === "blue" ? "text-yellow-500" : "text-orange-500"
                            }`}
                          />
                        </div>
                        <h4 className="font-semibold text-white text-sm mb-1 uppercase">
                          {item.title}
                        </h4>
                        <p className="text-gray-300 text-xs">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-none p-6 mb-6 border-4 border-yellow-600/40 relative">
                    {/* Corner screws */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <h4 className="font-semibold text-white mb-3 flex items-center uppercase">
                      <Shield className="w-5 h-5 mr-2 text-yellow-500" />
                      Important Note
                    </h4>
                    <p className="text-gray-300">
                      We do not sell your personal information. All data usage
                      is strictly for providing and improving our Service.
                    </p>
                  </div>
                </motion.section>

                {/* How We Share Information */}
                <motion.section
                  ref={(el) => setSectionRef(el, "data-sharing")}
                  id="data-sharing"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-none border-4 border-orange-600/40 flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                      How We Share Information
                    </h2>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800 to-black rounded-none border-8 border-gray-600 p-6 relative">
                    {/* Corner screws */}
                    <div className="absolute -top-3 -left-3 w-5 h-5 bg-gray-800 rounded-full border-3 border-gray-500"></div>
                    <div className="absolute -top-3 -right-3 w-5 h-5 bg-gray-800 rounded-full border-3 border-gray-500"></div>
                    <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gray-800 rounded-full border-3 border-gray-500"></div>
                    <div className="absolute -bottom-3 -right-3 w-5 h-5 bg-gray-800 rounded-full border-3 border-gray-500"></div>
                    <p className="text-gray-300 mb-6">
                      We may share information in the following limited cases:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white flex items-center uppercase">
                          <CheckCircle2 className="w-5 h-5 mr-2 text-yellow-500" />
                          Service Providers
                        </h4>
                        {[
                          "Cloud hosting providers (AWS, OCI, etc.)",
                          "Payment processors (Stripe, PayPal)",
                          "Email and communication tools",
                          "Analytics providers (Google Analytics)",
                        ].map((item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center p-3 bg-yellow-500/10 rounded-none border-4 border-yellow-600/40"
                          >
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            <span className="text-gray-300">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white flex items-center uppercase">
                          <Shield className="w-5 h-5 mr-2 text-orange-500" />
                          Legal & Business
                        </h4>
                        {[
                          "Legal compliance requirements",
                          "Business partners and integrations",
                          "Mergers, acquisitions, or asset sales",
                          "Protecting safety, rights, or property",
                        ].map((item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center p-3 bg-orange-500/10 rounded-none border-4 border-orange-600/40"
                          >
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            <span className="text-gray-300">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Data Retention */}
                <motion.section
                  ref={(el) => setSectionRef(el, "data-retention")}
                  id="data-retention"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                      Data Retention
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-none p-6 border-4 border-yellow-600/40 relative">
                    {/* Corner screws */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <p className="text-gray-300 mb-4">
                      We retain personal information for as long as necessary to
                      fulfill the purposes outlined in this Privacy Policy,
                      comply with our legal obligations, and resolve disputes.
                    </p>
                    <p className="text-gray-300">
                      You may request deletion of your account or associated
                      data at any time (see Your Rights section).
                    </p>
                  </div>
                </motion.section>

                {/* Data Security */}
                <motion.section
                  ref={(el) => setSectionRef(el, "data-security")}
                  id="data-security"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <Lock className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                      Data Security
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-none p-8 text-gray-900 border-8 border-yellow-600/60 relative shadow-[0_0_40px_rgba(253,176,34,0.5),inset_0_0_30px_rgba(0,0,0,0.3)]">
                    {/* Corner screws */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9)]"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9)]"></div>
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9)]"></div>
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9)]"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      {[
                        {
                          icon: Shield,
                          title: "Encryption",
                          desc: "Data encrypted in transit and at rest",
                        },
                        {
                          icon: Lock,
                          title: "Access Control",
                          desc: "Authentication protocols and controls",
                        },
                        {
                          icon: Server,
                          title: "Security Testing",
                          desc: "Regular audits and penetration testing",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                          className="bg-gray-900/40 rounded-none p-6 border-4 border-gray-800/50 relative"
                        >
                          {/* Corner screws */}
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-700"></div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-700"></div>
                          <div className="w-12 h-12 bg-gray-800/60 rounded-none border-4 border-gray-700 flex items-center justify-center mx-auto mb-4">
                            <item.icon className="w-6 h-6 text-yellow-500" />
                          </div>
                          <h4 className="font-semibold mb-2 uppercase">{item.title}</h4>
                          <p className="text-gray-200 text-sm">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 bg-yellow-500/10 rounded-none p-4 border-4 border-yellow-600/40 relative">
                    {/* Corner screws */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <p className="text-gray-300 text-sm">
                      <strong className="text-yellow-400">Note:</strong> While we implement
                      industry-standard safeguards, no system is entirely
                      secure. We cannot guarantee absolute security of data
                      transmitted online.
                    </p>
                  </div>
                </motion.section>

                {/* Cookies & Tracking */}
                <motion.section
                  ref={(el) => setSectionRef(el, "cookies")}
                  id="cookies"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-none border-4 border-orange-600/40 flex items-center justify-center mr-4">
                      <Eye className="w-6 h-6 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                      Cookies & Tracking Technologies
                    </h2>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800 to-black rounded-none border-8 border-gray-600 p-6 relative">
                    {/* Corner screws */}
                    <div className="absolute -top-3 -left-3 w-5 h-5 bg-gray-800 rounded-full border-3 border-gray-500"></div>
                    <div className="absolute -top-3 -right-3 w-5 h-5 bg-gray-800 rounded-full border-3 border-gray-500"></div>
                    <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gray-800 rounded-full border-3 border-gray-500"></div>
                    <div className="absolute -bottom-3 -right-3 w-5 h-5 bg-gray-800 rounded-full border-3 border-gray-500"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-white mb-4 flex items-center uppercase">
                          <CheckCircle2 className="w-5 h-5 mr-2 text-yellow-500" />
                          How We Use Cookies
                        </h4>
                        <ul className="text-gray-300 space-y-3">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Authenticate sessions and remember preferences
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Analyze usage patterns and improve functionality
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            Deliver relevant marketing or product information
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-4 flex items-center uppercase">
                          <UserCheck className="w-5 h-5 mr-2 text-orange-500" />
                          Your Control
                        </h4>
                        <ul className="text-gray-300 space-y-3">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Manage or disable cookies in browser settings
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Opt out of Google Analytics tracking
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Some features may not work without cookies
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Your Rights */}
                <motion.section
                  ref={(el) => setSectionRef(el, "your-rights")}
                  id="your-rights"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <UserCheck className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                      Your Rights & Choices
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        right: "Access",
                        desc: "Request a copy of information we hold about you",
                        icon: Database,
                      },
                      {
                        right: "Correction",
                        desc: "Request corrections to inaccurate data",
                        icon: FileText,
                      },
                      {
                        right: "Deletion",
                        desc: "Request deletion of your account and data",
                        icon: Shield,
                      },
                      {
                        right: "Portability",
                        desc: "Request data in machine-readable format",
                        icon: Server,
                      },
                      {
                        right: "Opt-Out",
                        desc: "Withdraw consent or unsubscribe from communications",
                        icon: Eye,
                      },
                      {
                        right: "Do Not Sell/Share",
                        desc: "Request we not sell/share data for marketing",
                        icon: Lock,
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.right}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-none p-4 border-4 border-yellow-600/40 shadow-sm hover:shadow-[0_0_20px_rgba(253,176,34,0.3)] transition-all relative"
                      >
                        {/* Corner screws */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-none border-2 border-yellow-600/40 flex items-center justify-center mr-3">
                            <item.icon className="w-4 h-4 text-yellow-500" />
                          </div>
                          <h4 className="font-semibold text-white uppercase">
                            {item.right}
                          </h4>
                        </div>
                        <p className="text-gray-300 text-sm">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-none p-6 border-4 border-yellow-600/40 relative">
                    {/* Corner screws */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <h4 className="font-semibold text-white mb-3 uppercase">
                      Additional Protections
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-yellow-400 mb-2 uppercase">
                          California Rights (CCPA/CPRA)
                        </h5>
                        <p className="text-gray-300 text-sm">
                          Right to know, delete, opt-out of data sale/sharing,
                          and non-discrimination.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-orange-400 mb-2 uppercase">
                          GDPR Rights (EU/EEA/UK)
                        </h5>
                        <p className="text-gray-300 text-sm">
                          Lawful basis for processing, withdraw consent, lodge
                          complaints with authorities.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Contact Information */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mt-16 pt-8 border-t-4 border-yellow-600/30"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-4 uppercase">
                      Questions About Data Privacy?
                    </h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                      Contact us with any questions, requests, or complaints
                      regarding this Privacy Policy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href={"/contact-us"}>
                        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold uppercase border-2 border-yellow-600 shadow-lg shadow-yellow-500/50 rounded-none">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">
                      DMR • Las Vegas, Nevada • Email: support@sledge.dev
                    </p>
                  </div>
                </motion.section>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
