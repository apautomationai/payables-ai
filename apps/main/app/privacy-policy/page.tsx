'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
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
  Globe,
  Search,
  Scan,
  Brain,
  BarChart3,
  Server
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { FloatingElements, GeometricPattern } from '@/components/landing/animated-icons';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: FileText },
    { id: 'invoice-data', title: 'Invoice Data Processing', icon: Scan },
    { id: 'data-collection', title: 'Data Collection', icon: Database },
    { id: 'data-usage', title: 'How We Use Data', icon: BarChart3 },
    { id: 'data-protection', title: 'Data Protection', icon: Lock },
    { id: 'data-sharing', title: 'Data Sharing', icon: Users },
    { id: 'your-rights', title: 'Your Rights', icon: UserCheck },
    { id: 'security', title: 'Security Measures', icon: Shield }
  ];

  // Set up intersection observer for auto-scroll navigation
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Adjusted for better trigger points
      threshold: 0
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
      observers.forEach(observer => observer.disconnect());
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
        behavior: 'smooth'
      });
    }
  };

  const setSectionRef = (element: HTMLElement | null, sectionId: string) => {
    sectionRefs.current[sectionId] = element;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-emerald-50/5 relative overflow-hidden">
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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            Protecting your financial data is our top priority. Learn how Payables.ai processes and secures your invoice information.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-slate-500"
          >
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Last updated: December 1, 2025
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2 text-emerald-500" />
              Invoice Data Processing
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-500" />
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 sticky top-8">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <ArrowRight className="w-4 h-4 mr-2 text-blue-500" />
                Policy Sections
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center group ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-700 border border-blue-200 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <IconComponent className={`w-4 h-4 mr-3 ${
                        activeSection === section.id ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      {section.title}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-3">Data Requests</h4>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-blue-200 hover:bg-blue-50"
                    onClick={() => scrollToSection('your-rights')}
                  >
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    Contact DPO
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-emerald-200 hover:bg-emerald-50"
                    onClick={() => scrollToSection('your-rights')}
                  >
                    <Database className="w-4 h-4 mr-2 text-emerald-500" />
                    Data Export
                  </Button>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                  <span>Progress</span>
                  <span className="font-medium text-blue-600">
                    {Math.round((sections.findIndex(s => s.id === activeSection) + 1) / sections.length * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%` 
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-8">
              {/* Introduction */}
              <motion.section
                ref={(el) => setSectionRef(el, 'introduction')}
                id="introduction"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Introduction</h2>
                    <p className="text-blue-600 font-medium">Payables.ai Invoice Processing</p>
                  </div>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 mb-4">
                    Welcome to Payables.ai's Privacy Policy. We specialize in intelligent invoice processing and data extraction, and we're committed to protecting your financial information with the highest security standards.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-200/50">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-500" />
                      AI-Powered Processing
                    </h4>
                    <p className="text-slate-600">
                      Our advanced AI systems extract critical data from your invoices while maintaining strict data privacy and security protocols.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Invoice Data Processing */}
              <motion.section
                ref={(el) => setSectionRef(el, 'invoice-data')}
                id="invoice-data"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                    <Scan className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Invoice Data Processing</h2>
                    <p className="text-emerald-600 font-medium">What We Extract & How We Protect It</p>
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
                    className="bg-blue-50 rounded-xl p-6 border border-blue-200"
                  >
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Search className="w-5 h-5 mr-2 text-blue-500" />
                      Data We Extract
                    </h3>
                    <ul className="text-slate-600 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        Vendor information & contact details
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        Invoice numbers & dates
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        Line items & amounts
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        Tax calculations & totals
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        Payment terms & due dates
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    className="bg-emerald-50 rounded-xl p-6 border border-emerald-200"
                  >
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-emerald-500" />
                      Data Protection
                    </h3>
                    <ul className="text-slate-600 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-1 flex-shrink-0" />
                        End-to-end encryption
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-1 flex-shrink-0" />
                        Secure data processing
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-1 flex-shrink-0" />
                        Regular security audits
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-1 flex-shrink-0" />
                        Compliance with financial regulations
                      </li>
                    </ul>
                  </motion.div>
                </motion.div>
              </motion.section>

              {/* Data Collection */}
              <motion.section
                ref={(el) => setSectionRef(el, 'data-collection')}
                id="data-collection"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Data We Collect</h2>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                        Invoice Data
                      </h4>
                      <ul className="text-slate-600 space-y-2">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Uploaded invoice documents
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Extracted financial data
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Vendor information
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Payment details
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                        <UserCheck className="w-5 h-5 mr-2 text-emerald-500" />
                        Account Data
                      </h4>
                      <ul className="text-slate-600 space-y-2">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          Contact information
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          Usage patterns
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          System preferences
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          Support interactions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Data Usage */}
              <motion.section
                ref={(el) => setSectionRef(el, 'data-usage')}
                id="data-usage"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">How We Use Your Data</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: Brain, title: 'AI Processing', desc: 'Extract key invoice data using machine learning', color: 'blue' },
                    { icon: FileText, title: 'Data Organization', desc: 'Categorize and structure financial information', color: 'blue' },
                    { icon: BarChart3, title: 'Analytics', desc: 'Provide insights and reporting features', color: 'emerald' },
                    { icon: Shield, title: 'Security', desc: 'Monitor and prevent fraudulent activities', color: 'emerald' },
                    { icon: UserCheck, title: 'Personalization', desc: 'Customize your invoice processing workflow', color: 'blue' },
                    { icon: Server, title: 'Service Improvement', desc: 'Enhance AI accuracy and features', color: 'emerald' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-${item.color}-50 rounded-xl p-4 border border-${item.color}-200`}
                    >
                      <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                        <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-xs">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Data Protection */}
              <motion.section
                ref={(el) => setSectionRef(el, 'data-protection')}
                id="data-protection"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Data Protection & Encryption</h2>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl p-8 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {[
                      { icon: Shield, title: 'Encryption', desc: 'AES-256 encryption for all data' },
                      { icon: Lock, title: 'Access Control', desc: 'Role-based permissions system' },
                      { icon: Server, title: 'Secure Storage', desc: 'SOC 2 compliant infrastructure' }
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="bg-white/20 rounded-xl p-6 backdrop-blur-sm border border-white/30"
                      >
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-white/80 text-sm">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Data Sharing */}
              <motion.section
                ref={(el) => setSectionRef(el, 'data-sharing')}
                id="data-sharing"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Data Sharing & Third Parties</h2>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <p className="text-slate-600 mb-6">
                    We do not sell your invoice data. We only share information with trusted partners when necessary for service delivery:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-800 flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-blue-500" />
                        Permitted Sharing
                      </h4>
                      {[
                        'Cloud infrastructure providers',
                        'Payment processing partners',
                        'Legal compliance requirements',
                        'Service improvement partners'
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-slate-700">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-800 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-500" />
                        Never Shared
                      </h4>
                      {[
                        'Raw invoice documents',
                        'Complete financial records',
                        'Personal vendor information',
                        'Sensitive business data'
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                        >
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          <span className="text-slate-700">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Your Rights */}
              <motion.section
                ref={(el) => setSectionRef(el, 'your-rights')}
                id="your-rights"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Your Data Rights</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { right: 'Access & Export', desc: 'Download your processed invoice data', icon: Database },
                    { right: 'Correction', desc: 'Update inaccurate extracted information', icon: FileText },
                    { right: 'Deletion', desc: 'Remove your data from our systems', icon: Shield },
                    { right: 'Processing Limits', desc: 'Restrict how we process your data', icon: Lock },
                    { right: 'Objection', desc: 'Opt-out of certain data uses', icon: Eye },
                    { right: 'Portability', desc: 'Transfer data to other services', icon: Server }
                  ].map((item, index) => (
                    <motion.div
                      key={item.right}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <item.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-slate-800">{item.right}</h4>
                      </div>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Security Measures */}
              <motion.section
                ref={(el) => setSectionRef(el, 'security')}
                id="security"
                {...fadeInUp}
                className="scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Security Measures</h2>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-blue-500" />
                        Technical Security
                      </h4>
                      <ul className="text-slate-600 space-y-3">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          End-to-end encryption for all data transfers
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Regular security penetration testing
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Multi-factor authentication required
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Real-time security monitoring
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                        <UserCheck className="w-5 h-5 mr-2 text-emerald-500" />
                        Organizational Security
                      </h4>
                      <ul className="text-slate-600 space-y-3">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          Employee security training programs
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          Strict access control policies
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          Regular compliance audits
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          Data protection officer oversight
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Contact Information */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-16 pt-8 border-t border-slate-200"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Questions About Data Privacy?</h3>
                  <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                    Our Data Protection Officer is here to help with any questions about your invoice data privacy and security.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={"/contact-us"}>
                    <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Data Protection Officer
                    </Button>
                    </Link>
                  </div>
                </div>
              </motion.section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

