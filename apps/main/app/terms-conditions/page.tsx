"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Scale,
  UserCheck,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Users,
  Globe,
  Lock,
  Database,
  Mail,
  Clock,
  BookOpen,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  FloatingElements,
  GeometricPattern,
} from "@/components/landing/animated-icons";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("eligibility");
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sections = [
    { id: "eligibility", title: "Eligibility & Registration", icon: UserCheck },
    { id: "license", title: "License to Use", icon: CheckCircle2 },
    { id: "subscriptions", title: "Subscriptions & Payments", icon: Scale },
    { id: "user-content", title: "User Content & Data", icon: FileText },
    { id: "data-security", title: "Data Security & Privacy", icon: Shield },
    { id: "acceptable-use", title: "Acceptable Use", icon: AlertTriangle },
    { id: "third-party", title: "Third-Party Services", icon: Users },
    { id: "warranties", title: "Warranties & Liability", icon: Shield },
    { id: "governing-law", title: "Governing Law", icon: Globe },
  ];

  // Auto-scroll navigation setup
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (isScrolling) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isScrolling]);

  const scrollToSection = useCallback((sectionId: string) => {
    setIsScrolling(true);
    setActiveSection(sectionId);

    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  }, []);

  const setSectionRef = useCallback(
    (element: HTMLElement | null, sectionId: string) => {
      sectionRefs.current[sectionId] = element;
    },
    []
  );

  // Fallback scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [isScrolling]);

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
                  <Scale className="w-10 h-10 text-gray-900" />
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
                  <FileText className="w-4 h-4 text-gray-900" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4 uppercase"
            >
              Terms and Conditions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Please read these terms carefully before using DMR's products,
              software, and services.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-400"
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
                Effective: [Month Day, Year]
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Last Updated: [Month Day, Year]
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-yellow-500" />
                Age 18+ Only
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
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-none shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] border-8 border-gray-600 p-6 sticky top-8 w-2xs relative">
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
                  Terms Sections
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
                          className={`w-4 h-4 mr-3 ${
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
                    Quick Actions
                  </h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-4 border-yellow-600/50 hover:bg-yellow-500/20 hover:border-yellow-600 text-gray-300 hover:text-yellow-400 rounded-none font-medium uppercase"
                      onClick={() =>
                        (window.location.href = "mailto:support@sledge.dev")
                      }
                    >
                      <Mail className="w-4 h-4 mr-2 text-yellow-500" />
                      Contact Support
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-4 border-orange-600/50 hover:bg-orange-500/20 hover:border-orange-600 text-gray-300 hover:text-orange-400 rounded-none font-medium uppercase"
                      onClick={() => window.print()}
                    >
                      <FileText className="w-4 h-4 mr-2 text-orange-500" />
                      Print Terms
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
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-gray-300 mb-4">
                      These Terms and Conditions ("Terms") govern the use of all
                      products, software, mobile applications, and web services
                      (collectively, the "Service") provided by DMR, a Nevada
                      corporation (doing business as SLEDGE) ("DMR," "we," "us,"
                      or "our").
                    </p>
                    <p className="text-lg text-gray-300 mb-6">
                      By accessing or using the Service, you agree to these
                      Terms. If you do not agree, you may not use the Service.
                    </p>

                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-none p-6 border-4 border-yellow-600/40 relative">
                      {/* Corner screws */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <h4 className="font-semibold text-white mb-3 flex items-center uppercase">
                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                        Important Notice
                      </h4>
                      <p className="text-gray-300">
                        These terms constitute a legally binding agreement. If
                        you disagree with any part, you may not access our
                        services.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Eligibility and Account Registration */}
                <motion.section
                  ref={(el) => setSectionRef(el, "eligibility")}
                  id="eligibility"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <UserCheck className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">
                        Eligibility and Account Registration
                      </h2>
                      <p className="text-yellow-400 font-medium uppercase">
                        Requirements for Service Use
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-gray-300 mb-4">
                      To use the Service, you must:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-gray-800 to-black rounded-none p-4 border-4 border-gray-600 relative">
                        {/* Corner screws */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                        <h5 className="font-semibold text-white mb-2 flex items-center uppercase">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-yellow-500" />
                          Age Requirement
                        </h5>
                        <p className="text-gray-300 text-sm">
                          Be at least 18 years old and legally capable of
                          entering into a binding contract.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-800 to-black rounded-none p-4 border-4 border-gray-600 relative">
                        {/* Corner screws */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                        <h5 className="font-semibold text-white mb-2 flex items-center uppercase">
                          <UserCheck className="w-4 h-4 mr-2 text-orange-500" />
                          Account Information
                        </h5>
                        <p className="text-gray-300 text-sm">
                          Provide accurate, current, and complete registration
                          information.
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 rounded-none p-6 border-4 border-yellow-600/40 relative">
                      {/* Corner screws */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <h4 className="font-semibold text-white mb-3 flex items-center uppercase">
                        <Shield className="w-5 h-5 mr-2 text-yellow-500" />
                        Account Security
                      </h4>
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          Maintain the confidentiality of your login credentials
                          and all activity under your account
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          You are responsible for all actions taken under your
                          account, whether authorized or not
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          Notify us immediately at [Support Email TBD] if you
                          suspect unauthorized access
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* License to Use the Service */}
                <motion.section
                  ref={(el) => setSectionRef(el, "license")}
                  id="license"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-none border-4 border-orange-600/40 flex items-center justify-center mr-4">
                      <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase">
                        License to Use the Service
                      </h2>
                      <p className="text-orange-400 font-medium uppercase">
                        Limited Usage Rights
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-none p-6 mb-6 border-4 border-yellow-600/40 relative">
                    {/* Corner screws */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                    <h4 className="font-semibold text-white mb-4 uppercase">
                      License Grant:
                    </h4>
                    <p className="text-gray-300 mb-4">
                      DMR grants you a limited, non-exclusive, non-transferable,
                      revocable license to access and use the Service for your
                      internal business or personal purposes, in accordance with
                      these Terms.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          feature: "Prohibited: Copy/Modify",
                          desc: "Do not copy, modify, decompile, or reverse engineer the Service",
                        },
                        {
                          feature: "Prohibited: Resell",
                          desc: "Do not rent, lease, resell, sublicense, or distribute the Service",
                        },
                        {
                          feature: "Prohibited: Circumvent Security",
                          desc: "Do not circumvent or disable security features",
                        },
                        {
                          feature: "IP Rights",
                          desc: "DMR retains all rights to the Service and related IP",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={item.feature}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-gradient-to-br from-gray-800 to-black rounded-none p-4 border-4 border-orange-600/40 shadow-sm relative"
                        >
                          {/* Corner screws */}
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                            <span className="font-medium text-white uppercase">
                              {item.feature}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* Subscriptions, Payments, and Billing */}
                <motion.section
                  ref={(el) => setSectionRef(el, "subscriptions")}
                  id="subscriptions"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <Scale className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                      Subscriptions, Payments, and Billing
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-yellow-500/10 rounded-none p-6 border-4 border-yellow-600/40 relative">
                      {/* Corner screws */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <h4 className="font-semibold text-white mb-3 flex items-center uppercase">
                        <FileText className="w-5 h-5 mr-2 text-yellow-500" />
                        Free and Paid Plans
                      </h4>
                      <p className="text-gray-300">
                        DMR offers both free and paid plans. The features,
                        limits, and billing details for each plan are described
                        on our pricing page or in your account portal.
                      </p>
                    </div>

                    <div className="bg-orange-500/10 rounded-none p-6 border-4 border-orange-600/40 relative">
                      {/* Corner screws */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"></div>
                      <h4 className="font-semibold text-white mb-3 flex items-center uppercase">
                        <Scale className="w-5 h-5 mr-2 text-orange-500" />
                        Payments & Billing
                      </h4>
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          All paid subscriptions require a valid payment method
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          You authorize us to charge your payment method on a
                          recurring basis
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          Fees are quoted in U.S. dollars, exclusive of taxes,
                          and non-refundable
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                          Subscriptions automatically renew unless canceled
                          before renewal
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* User Content and Data Ownership */}
                <motion.section
                  ref={(el) => setSectionRef(el, "user-content")}
                  id="user-content"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-none border-4 border-orange-600/40 flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      User Content and Data Ownership
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-none p-8 text-white">
                    <h4 className="font-semibold text-xl mb-6 text-center">
                      Content Rights & Responsibilities
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          icon: FileText,
                          title: "Ownership",
                          desc: "You retain all ownership rights to your data and content",
                        },
                        {
                          icon: Database,
                          title: "License to DMR",
                          desc: "You grant DMR a license to process your content for service delivery",
                        },
                        {
                          icon: UserCheck,
                          title: "Responsibility",
                          desc: "You are responsible for your content and its compliance with laws",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                          className="bg-gradient-to-br from-gray-800 to-black/20 rounded-none p-6 backdrop-blur-sm border border-white/30 text-center"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <item.icon className="w-6 h-6" />
                          </div>
                          <h5 className="font-semibold mb-2">{item.title}</h5>
                          <p className="text-white/80 text-sm">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* Data Security, Privacy, and Compliance */}
                <motion.section
                  ref={(el) => setSectionRef(el, "data-security")}
                  id="data-security"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Data Security, Privacy, and Compliance
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-yellow-500/10 rounded-none p-6 border-4 border-yellow-600/40">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-yellow-500" />
                        Security Measures
                      </h4>
                      <p className="text-gray-300 text-sm">
                        DMR implements reasonable administrative, physical, and
                        technical safeguards to protect data integrity and
                        confidentiality.
                      </p>
                      <p className="text-gray-300 text-sm mt-2">
                        However, no system is perfectly secure, and DMR cannot
                        guarantee absolute protection from unauthorized access
                        or loss.
                      </p>
                    </div>
                    <div className="bg-orange-500/10 rounded-none p-6 border-4 border-orange-600/40">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-orange-500" />
                        Privacy & Compliance
                      </h4>
                      <p className="text-gray-300 text-sm">
                        Your use is governed by our Privacy Policy. You agree
                        that DMR may process and store data in the United States
                        or other jurisdictions where we operate.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Acceptable Use Policy */}
                <motion.section
                  ref={(el) => setSectionRef(el, "acceptable-use")}
                  id="acceptable-use"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-none border-4 border-orange-600/40 flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Acceptable Use Policy
                    </h2>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800 to-black rounded-none border-4 border-gray-600 p-6">
                    <p className="text-gray-300 mb-6">You agree not to:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                          Prohibited Activities
                        </h4>
                        <ul className="text-gray-300 space-y-2">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500/100 rounded-full mr-3"></div>
                            Violate any applicable law or third-party right
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500/100 rounded-full mr-3"></div>
                            Upload or transmit malware or harmful code
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500/100 rounded-full mr-3"></div>
                            Attempt unauthorized access to infrastructure
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                          Additional Restrictions
                        </h4>
                        <ul className="text-gray-300 space-y-2">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500/100 rounded-full mr-3"></div>
                            Use to harass, spam, defraud, or mislead
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500/100 rounded-full mr-3"></div>
                            Exceed rate limits or data usage caps
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500/100 rounded-full mr-3"></div>
                            We may suspend accounts for violations
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Third-Party Services and Integrations */}
                <motion.section
                  ref={(el) => setSectionRef(el, "third-party")}
                  id="third-party"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Third-Party Services and Integrations
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-none p-6 border-4 border-yellow-600/40">
                    <h4 className="font-semibold text-white mb-3">
                      External Services
                    </h4>
                    <p className="text-gray-300 mb-4">
                      The Service may integrate with third-party platforms
                      (e.g., Google, Microsoft, payment gateways, analytics
                      providers).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-gray-800 to-black rounded-lg p-4 border border-blue-100">
                        <h5 className="font-medium text-white mb-1">
                          No Responsibility
                        </h5>
                        <p className="text-gray-300 text-sm">
                          DMR is not responsible for functionality, accuracy, or
                          availability of third-party services.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-800 to-black rounded-lg p-4 border border-purple-100">
                        <h5 className="font-medium text-white mb-1">
                          Third-Party Terms
                        </h5>
                        <p className="text-gray-300 text-sm">
                          Use of third-party integrations is governed by the
                          third party's own terms and privacy policies.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Warranties & Liability */}
                <motion.section
                  ref={(el) => setSectionRef(el, "warranties")}
                  id="warranties"
                  {...fadeInUp}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-none border-4 border-orange-600/40 flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Warranties & Liability
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-orange-500/10 rounded-none p-6 border-4 border-orange-600/40">
                      <h4 className="font-semibold text-white mb-3">
                        Disclaimer of Warranties
                      </h4>
                      <p className="text-gray-300 mb-4">
                        The Service is provided "as is" and "as available"
                        without warranties of any kind, express or implied. DMR
                        disclaims all implied warranties of merchantability,
                        fitness for a particular purpose, and non-infringement.
                      </p>
                      <p className="text-gray-300">
                        We make no guarantees regarding uptime, accuracy, or
                        reliability.
                      </p>
                    </div>

                    <div className="bg-yellow-500/10 rounded-none p-6 border-4 border-yellow-600/40">
                      <h4 className="font-semibold text-white mb-3">
                        Limitation of Liability
                      </h4>
                      <p className="text-gray-300 mb-2">
                        To the maximum extent permitted by law:
                      </p>
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          DMR will not be liable for any indirect, incidental,
                          special, consequential, or punitive damages
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          DMR's total aggregate liability shall not exceed the
                          amount paid by you during the 12 months preceding the
                          claim
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* Governing Law */}
                <motion.section
                  ref={(el) => setSectionRef(el, "governing-law")}
                  id="governing-law"
                  {...fadeInUp}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-none border-4 border-yellow-600/40 flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Governing Law
                    </h2>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800 to-black rounded-none border-4 border-gray-600 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Scale className="w-5 h-5 mr-2 text-yellow-500" />
                          Jurisdiction
                        </h4>
                        <p className="text-gray-300">
                          These Terms are governed by the laws of the State of
                          Nevada, without regard to conflict of law principles.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-orange-500" />
                          Dispute Resolution
                        </h4>
                        <p className="text-gray-300">
                          Any dispute shall be resolved exclusively in the state
                          or federal courts located in Clark County, Nevada, and
                          you consent to their jurisdiction.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Contact & Agreement */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mt-16 pt-8 border-t-4 border-yellow-600/30"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Questions About These Terms?
                    </h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                      Contact us with any questions or concerns regarding these
                      Terms and Conditions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold uppercase border-2 border-yellow-600 shadow-lg shadow-yellow-500/50 rounded-none"
                        onClick={() =>
                          (window.location.href = "mailto: support@sledge.dev")
                        }
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-200 hover:bg-yellow-500/10"
                        onClick={() => scrollToSection("eligibility")}
                      >
                        Back to Top
                      </Button>
                    </div>
                    <p className="text-slate-500 text-sm mt-4">
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
