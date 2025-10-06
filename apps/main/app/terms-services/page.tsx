// app/terms/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
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
  BookOpen
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { FloatingElements, GeometricPattern } from '@/components/landing/animated-icons';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle2 },
    { id: 'services', title: 'Services Description', icon: FileText },
    { id: 'user-obligations', title: 'User Obligations', icon: UserCheck },
    { id: 'data-processing', title: 'Data Processing', icon: Database },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: BookOpen },
    { id: 'payment-terms', title: 'Payment Terms', icon: Scale },
    { id: 'liability', title: 'Liability & Warranty', icon: Shield },
    { id: 'termination', title: 'Termination', icon: AlertTriangle },
    { id: 'governing-law', title: 'Governing Law', icon: Globe }
  ];

  // Auto-scroll navigation setup
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
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
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  }, []);

  const setSectionRef = useCallback((element: HTMLElement | null, sectionId: string) => {
    sectionRefs.current[sectionId] = element;
  }, []);

  // Fallback scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
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

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [isScrolling]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-purple-50/5 relative overflow-hidden">
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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Scale className="w-10 h-10 text-white" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FileText className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Terms of Service
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            Please read these terms carefully before using Payables.ai's intelligent invoice processing services.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-slate-500"
          >
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Effective: December 1, 2025
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2 text-purple-500" />
              Invoice Processing Agreement
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Business Users Only
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
                Terms Sections
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
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm'
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
                <h4 className="font-semibold text-slate-800 mb-3">Quick Actions</h4>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-blue-200 hover:bg-blue-50"
                    onClick={() => window.location.href = 'mailto:legal@payables.ai'}
                  >
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    Contact Legal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-purple-200 hover:bg-purple-50"
                    onClick={() => window.print()}
                  >
                    <FileText className="w-4 h-4 mr-2 text-purple-500" />
                    Print Terms
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
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
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
              
              {/* Acceptance of Terms */}
              <motion.section
                ref={(el) => setSectionRef(el, 'acceptance')}
                id="acceptance"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Acceptance of Terms</h2>
                    <p className="text-blue-600 font-medium">Legal Agreement for Service Use</p>
                  </div>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 mb-4">
                    By accessing or using Payables.ai's invoice processing services, you agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 mb-6">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-purple-500" />
                      Important Notice
                    </h4>
                    <p className="text-slate-600">
                      These terms constitute a legally binding agreement. If you disagree with any part, you may not access our services.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <h5 className="font-semibold text-slate-800 mb-2 flex items-center">
                        <UserCheck className="w-4 h-4 mr-2 text-blue-500" />
                        Who Can Use
                      </h5>
                      <p className="text-slate-600 text-sm">
                        Businesses and individuals aged 18+ with authority to bind their organization.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <h5 className="font-semibold text-slate-800 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-purple-500" />
                        Agreement Duration
                      </h5>
                      <p className="text-slate-600 text-sm">
                        Effective from first use until terminated by either party according to these terms.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Services Description */}
              <motion.section
                ref={(el) => setSectionRef(el, 'services')}
                id="services"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Services Description</h2>
                    <p className="text-purple-600 font-medium">AI-Powered Invoice Processing</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-slate-800 mb-4">Core Services Include:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { feature: 'Intelligent Data Extraction', desc: 'AI-powered extraction from invoices' },
                      { feature: 'Vendor Management', desc: 'Automated vendor information processing' },
                      { feature: 'Payment Processing', desc: 'Streamlined payment workflow automation' },
                      { feature: 'Analytics & Reporting', desc: 'Detailed financial insights and reports' }
                    ].map((item, index) => (
                      <motion.div
                        key={item.feature}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm"
                      >
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-500 mr-2" />
                          <span className="font-medium text-slate-800">{item.feature}</span>
                        </div>
                        <p className="text-slate-600 text-sm">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* User Obligations */}
              <motion.section
                ref={(el) => setSectionRef(el, 'user-obligations')}
                id="user-obligations"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">User Obligations</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-500" />
                      Account Security
                    </h4>
                    <ul className="text-slate-600 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        Maintain confidentiality of account credentials
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        Notify us immediately of unauthorized access
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        Use strong, unique passwords for your account
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-500" />
                      Content Guidelines
                    </h4>
                    <ul className="text-slate-600 space-y-2">
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                        Only upload legitimate business invoices
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                        Ensure you have rights to process uploaded documents
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                        Do not upload malicious or fraudulent content
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Data Processing */}
              <motion.section
                ref={(el) => setSectionRef(el, 'data-processing')}
                id="data-processing"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Data Processing</h2>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
                  <h4 className="font-semibold text-xl mb-6 text-center">AI Processing Agreement</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { 
                        icon: Database, 
                        title: 'Data License', 
                        desc: 'You grant us license to process your invoice data for service delivery' 
                      },
                      { 
                        icon: Shield, 
                        title: 'Security', 
                        desc: 'We implement enterprise-grade security for all processed data' 
                      },
                      { 
                        icon: UserCheck, 
                        title: 'Compliance', 
                        desc: 'Processing complies with applicable data protection laws' 
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="bg-white/20 rounded-xl p-6 backdrop-blur-sm border border-white/30 text-center"
                      >
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <h5 className="font-semibold mb-2">{item.title}</h5>
                        <p className="text-white/80 text-sm">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Intellectual Property */}
              <motion.section
                ref={(el) => setSectionRef(el, 'intellectual-property')}
                id="intellectual-property"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Intellectual Property</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-500" />
                      Your Content
                    </h4>
                    <p className="text-slate-600 text-sm">
                      You retain all rights to your original invoice documents and business data uploaded to our platform.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Scale className="w-5 h-5 mr-2 text-purple-500" />
                      Our Technology
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Payables.ai retains all rights to our AI algorithms, software, and platform technology.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Payment Terms */}
              <motion.section
                ref={(el) => setSectionRef(el, 'payment-terms')}
                id="payment-terms"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <Scale className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Payment Terms</h2>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-blue-500" />
                        Subscription Fees
                      </h4>
                      <ul className="text-slate-600 space-y-2">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Fees based on selected plan and usage
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Automatic monthly/annual billing
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          ️30-day notice for plan changes
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-purple-500" />
                        Payment Policies
                      </h4>
                      <ul className="text-slate-600 space-y-2">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          Late payments may incur fees
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          Service suspension for non-payment
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          No refunds for partial periods
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Liability & Warranty */}
              <motion.section
                ref={(el) => setSectionRef(el, 'liability')}
                id="liability"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Liability & Warranty</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-slate-800 mb-3">Service Warranty</h4>
                    <p className="text-slate-600 mb-4">
                      We provide the service "as is" and "as available" without warranties of any kind, either express or implied.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h5 className="font-medium text-slate-800 mb-1">Accuracy Disclaimer</h5>
                        <p className="text-slate-600 text-sm">
                          While our AI strives for accuracy, we don't guarantee 100% data extraction accuracy.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <h5 className="font-medium text-slate-800 mb-1">Uptime Commitment</h5>
                        <p className="text-slate-600 text-sm">
                          We target 99.5% service availability but don't guarantee uninterrupted access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Termination */}
              <motion.section
                ref={(el) => setSectionRef(el, 'termination')}
                id="termination"
                {...fadeInUp}
                className="mb-12 scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Termination</h2>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">By You</h4>
                      <ul className="text-slate-600 space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                          Cancel anytime through your account settings
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                          No termination fees for monthly plans
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">By Us</h4>
                      <ul className="text-slate-600 space-y-2">
                        <li className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                          For material breach of terms
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                          Non-payment of fees
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                          Illegal or fraudulent activity
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Governing Law */}
              <motion.section
                ref={(el) => setSectionRef(el, 'governing-law')}
                id="governing-law"
                {...fadeInUp}
                className="scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Governing Law</h2>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                        <Scale className="w-5 h-5 mr-2 text-blue-500" />
                        Jurisdiction
                      </h4>
                      <p className="text-slate-600">
                        These terms are governed by the laws of the State of Delaware, without regard to its conflict of law provisions.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-500" />
                        Dispute Resolution
                      </h4>
                      <p className="text-slate-600">
                        Any disputes shall be resolved through binding arbitration in Wilmington, Delaware, rather than in court.
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
                className="mt-16 pt-8 border-t border-slate-200"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Questions About These Terms?</h3>
                  <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                    Our legal team is available to answer any questions about our Terms of Service and how they apply to your use of Payables.ai.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => window.location.href = 'mailto:legal@payables.ai'}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Legal Team
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-blue-200 hover:bg-blue-50"
                      onClick={() => scrollToSection('acceptance')}
                    >
                      Back to Top
                    </Button>
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