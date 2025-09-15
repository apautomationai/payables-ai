"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { GeometricPattern } from "./animated-icons";
import {
  AnimatedLightning,
  AnimatedShield,
  AnimatedChart,
  AnimatedUsers,
  AnimatedWorkflow,
  AnimatedClock,
  PulsingOrb,
} from "./animated-icons";
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Workflow,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    animatedIcon: AnimatedLightning,
    title: "Lightning Fast Performance",
    description:
      "Experience blazing-fast load times and real-time data processing that keeps your team productive.",
    highlight: "99.9% Uptime",
    benefits: [
      "Sub-second response times",
      "Real-time synchronization",
      "Optimized for scale",
    ],
  },
  {
    icon: Shield,
    animatedIcon: AnimatedShield,
    title: "Enterprise Security",
    description:
      "Bank-grade security with end-to-end encryption, SSO integration, and compliance certifications.",
    highlight: "SOC 2 Compliant",
    benefits: [
      "256-bit encryption",
      "Multi-factor authentication",
      "Regular security audits",
    ],
  },
  {
    icon: BarChart3,
    animatedIcon: AnimatedChart,
    title: "Advanced Analytics",
    description:
      "Get deep insights into your business with customizable dashboards and automated reporting.",
    highlight: "Real-time Insights",
    benefits: [
      "Custom dashboards",
      "Predictive analytics",
      "Automated reports",
    ],
  },
  {
    icon: Users,
    animatedIcon: AnimatedUsers,
    title: "Team Collaboration",
    description:
      "Seamless collaboration tools that bring your team together, no matter where they work from.",
    highlight: "Unlimited Users",
    benefits: [
      "Real-time collaboration",
      "Role-based permissions",
      "Activity tracking",
    ],
  },
  {
    icon: Workflow,
    animatedIcon: AnimatedWorkflow,
    title: "Smart Automation",
    description:
      "Automate repetitive tasks and workflows to focus on what matters most to your business.",
    highlight: "AI-Powered",
    benefits: ["Workflow automation", "Smart notifications", "Custom triggers"],
  },
  {
    icon: Clock,
    animatedIcon: AnimatedClock,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to help you succeed.",
    highlight: "Always Available",
    benefits: [
      "Live chat support",
      "Priority assistance",
      "Comprehensive docs",
    ],
  },
];

export function Features() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
      <GeometricPattern />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-sm font-medium border-emerald-200 bg-emerald-50/50 text-emerald-700"
          >
            Features
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              succeed
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Powerful features designed to streamline your workflow and
            accelerate your growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative p-8 h-full dark:bg-white/80 bg-white/80 backdrop-blur-sm dark:border-gray-200 border-gray-200 hover:shadow-xl transition-all duration-300 group hover:border-blue-200 dark:hover:border-blue-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-t-lg transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                {/* Animated Vector Background */}
                <div className="absolute -top-12 -right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <feature.animatedIcon />
                </div>

                {/* Pulsing orb in corner */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                  <PulsingOrb color="#3B82F6" size={20} />
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 group-hover:from-blue-100 group-hover:to-emerald-100 transition-all duration-300 overflow-hidden">
                    {/* Mini animated icon in the icon container */}
                    <div className="absolute inset-0 opacity-20 scale-75">
                      <feature.animatedIcon />
                    </div>
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    {feature.highlight}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {feature.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
