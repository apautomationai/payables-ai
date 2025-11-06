"use client"

import { Card } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { GeometricPattern } from '@/components/landing/animated-icons'
import { 
  AnimatedEmail,
  AnimatedBrain,
  AnimatedIntegration,
  AnimatedPayment,
  AnimatedDatabase,
  AnimatedNotification,
  PulsingOrb 
} from '@/components/landing/animated-icons'
import { 
  Zap, 
  Mail,
  Scan,
  Brain,
  Link2,
  CreditCard,
  Database,
  Bell,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Scan,
    animatedIcon: AnimatedEmail,
    title: "AI Email Scanner",
    description: "Integrates with Gmail & Outlook to automatically detect invoices, so no more manual uploads.",
    highlight: "Auto-Detect",
    benefits: ["Gmail & Outlook integration", "Automatic invoice detection", "No manual uploads needed"]
  },
  {
    icon: Brain,
    animatedIcon: AnimatedBrain,
    title: "AI Auto Parsing",
    description: "Extracts and populates all invoice details with human-in-the-loop review for accuracy.",
    highlight: "Human-in-Loop",
    benefits: ["Automatic data extraction", "Human review process", "Accuracy validation"]
  },
  {
    icon: Link2,
    animatedIcon: AnimatedIntegration,
    title: "Seamless Accounting Integration",
    description: "Pushes parsed invoice data directly into your accounting platform for recording and payouts.",
    highlight: "Direct Push",
    benefits: ["Accounting platform sync", "Automatic data transfer", "Recording & payouts"]
  },
  {
    icon: CreditCard,
    animatedIcon: AnimatedPayment,
    title: "Accounts Payable",
    description: "Pay vendors directly from within the platform once invoices are logged.",
    highlight: "Direct Pay",
    benefits: ["In-platform payments", "Vendor management", "Invoice logging"]
  },
  {
    icon: Database,
    animatedIcon: AnimatedDatabase,
    title: "Project History & Records",
    description: "Centralized dashboard to log and track invoices, payments, and project layouts for complete visibility.",
    highlight: "Complete Visibility",
    benefits: ["Centralized dashboard", "Invoice & payment tracking", "Project layout visibility"]
  },
  {
    icon: Bell,
    animatedIcon: AnimatedNotification,
    title: "Real-Time Notifications & Alerts",
    description: "Get instant updates on new invoices, due dates, approvals, and payment status to avoid delays and missed payments.",
    highlight: "Instant Updates",
    benefits: ["New invoice alerts", "Due date reminders", "Payment status updates"]
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/5 to-orange-900/5" />
      <GeometricPattern />
      
      {/* Diamond plate texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 1px, transparent 0, transparent 50%),
                         repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 1px, transparent 0, transparent 50%)`,
        backgroundSize: '15px 15px'
      }} />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-yellow-600 bg-yellow-500/20 text-yellow-400 uppercase">
            Features
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 uppercase">
            Powerful Features for Modern AP Teams
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-300">
            Everything you need to automate pay apps, releases, and invoices — built with construction in mind
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative p-8 h-full md:h-[450px] bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 hover:border-yellow-600/50 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 group">
                {/* Corner screws/rivets */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-t-lg transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                {/* Animated Vector Background */}
                <div className="absolute -top-12 -right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <feature.animatedIcon />
                </div>
                
                {/* Pulsing orb in corner */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                  <PulsingOrb color="#FDB022" size={20} />
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative p-3 rounded-lg bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-2 border-yellow-600/40 group-hover:border-yellow-500 transition-all duration-300 overflow-hidden">
                    {/* Mini animated icon in the icon container */}
                    <div className="absolute inset-0 opacity-20 scale-75">
                      <feature.animatedIcon />
                    </div>
                    <feature.icon className="w-6 h-6 text-yellow-500" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium uppercase bg-yellow-500/20 text-yellow-400 border-yellow-600">
                    {feature.highlight}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300 uppercase">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div> */}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}