// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import ContactForm from '@/components/landing/contact-form';
import ContactInfo from '@/components/landing/contact-info';
import { 
  AnimatedEmail, 
  AnimatedIntegration, 
  AnimatedNotification,
  // ProfessionalWave,
  FloatingElements,
  GeometricPattern,
  ProfessionalIcons,
  PulsingOrb
} from '@/components/landing/animated-icons';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <GeometricPattern />
      <FloatingElements />
      <ProfessionalIcons />
      {/* <ProfessionalWave /> */}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto my-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-600 bg-clip-text text-transparent mb-4"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ContactForm onSuccess={() => setIsSubmitted(true)} />
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <ContactInfo />
          </motion.div>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center border border-slate-200/60 backdrop-blur-sm"
            >
              <div className="flex justify-center mb-4">
                <AnimatedNotification />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
              <p className="text-slate-600 mb-6">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}