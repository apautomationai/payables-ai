'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Label } from '@workspace/ui/components/label';
import { AnimatedBrain, AnimatedIntegration } from './animated-icons';

interface ContactFormProps {
  onSuccess: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    onSuccess();
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200/60 relative overflow-hidden"
    >
      {/* Background Icon */}
      <div className="absolute -right-8 -bottom-8 opacity-5">
        <AnimatedBrain />
      </div>

      <div className="flex items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Send us a message</h2>
          <p className="text-slate-600">We'll get back to you quickly</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Label htmlFor="name" className="text-slate-700 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="border-slate-200 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-50/50 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-white transition-all duration-300 placeholder:text-slate-400 dark:text-slate-700"
              placeholder="John Doe"
            />
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Label htmlFor="email" className="text-slate-700 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="border-slate-200 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-50/50 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-white transition-all duration-300 placeholder:text-slate-400 dark:text-slate-700"
              placeholder="john@example.com"
            />
          </motion.div>
        </div>

        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Label htmlFor="subject" className="text-slate-700 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleChange}
            className="border-slate-200 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-50/50 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-white transition-all duration-300 placeholder:text-slate-400 dark:text-slate-700"
            placeholder="How can we help you?"
          />
        </motion.div>

        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Label htmlFor="message" className="text-slate-700 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="border-slate-200 dark:border-slate-200 bg-slate-50/50 dark:bg-slate-50/50 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-slate-500 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-white transition-all duration-300 placeholder:text-slate-400 dark:text-slate-700"
            placeholder="Tell us more about your inquiry..."
          />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          className="pt-4"
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
          >
            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            
            <span className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </span>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}