// app/contact/components/ContactInfo.tsx
'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

const contactItems = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Our friendly team is here to help.',
    details: 'hello@company.com',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    delay: 0.1
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 8am to 5pm.',
    details: '+1 (555) 123-4567',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    delay: 0.2
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come say hello at our office.',
    details: '123 Business Ave, Suite 100\nNew York, NY 10001',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    delay: 0.3
  },
  {
    icon: Clock,
    title: 'Business Hours',
    description: "We're here when you need us.",
    details: 'Monday - Friday: 9:00 - 18:00\nSaturday: 10:00 - 16:00',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-slate-50',
    delay: 0.4
  }
];

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
      >
        <MessageCircle className="w-12 h-12 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Let's start a conversation</h3>
        <p className="text-purple-100 opacity-90">
          We're here to answer any questions you may have and create an effective solution for your needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {contactItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: item.delay }}
            whileHover={{ scale: 1.02 }}
            className={`${item.bgColor} rounded-xl p-6 border border-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} text-white shadow-lg`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-1">{item.title}</h4>
                <p className="text-slate-600 text-sm mb-2">{item.description}</p>
                <p className="text-slate-700 font-medium whitespace-pre-line">{item.details}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl p-8 text-white"
      >
        <h4 className="font-bold text-lg mb-2">Visit Our Office</h4>
        <p className="text-emerald-100 opacity-90 mb-4">
          Schedule a meeting and visit us in person
        </p>
        <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="h-32 flex items-center justify-center">
            <MapPin className="w-8 h-8 mr-2" />
            <span className="font-semibold">Interactive Map</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}