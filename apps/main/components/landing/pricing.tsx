"use client";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import { PulsingOrb } from "./animated-icons";
import { CheckCircle, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 5 team members",
      "10GB storage",
      "Basic analytics",
      "Email support",
      "Core automation features",
      "Mobile app access",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    price: 79,
    period: "month",
    description: "Ideal for growing businesses",
    features: [
      "Up to 25 team members",
      "100GB storage",
      "Advanced analytics",
      "Priority support",
      "Advanced automation",
      "Custom integrations",
      "API access",
      "Advanced reporting",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited team members",
      "1TB storage",
      "Custom analytics",
      "24/7 dedicated support",
      "AI-powered automation",
      "Custom integrations",
      "Full API access",
      "White-label options",
      "Advanced security",
      "Custom training",
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

export function Pricing() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-sm font-medium border-purple-200 bg-purple-50/50 text-purple-700"
          >
            Pricing
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple,
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              transparent{" "}
            </span>
            pricing
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Choose the perfect plan for your team. All plans include a 14-day
            free trial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`relative p-8 h-full ${
                  plan.popular
                    ? "border-blue-200 dark:border-blue-200 shadow-xl ring-1 dark:ring-blue-100 ring-blue-100 scale-105"
                    : "border-gray-200 dark:border-gray-200 hover:shadow-lg"
                } transition-all duration-300 dark:bg-white bg-white relative overflow-hidden`}
              >
                {/* Animated background for popular plan */}
                {plan.popular && (
                  <div className="absolute top-4 right-4 opacity-20">
                    <PulsingOrb color="#3B82F6" size={40} />
                  </div>
                )}

                {/* Corner orbs for all plans */}
                <div className="absolute bottom-4 left-4 opacity-0 hover:opacity-30 transition-opacity duration-300">
                  <PulsingOrb color="#10B981" size={25} />
                </div>

                {plan.popular && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-50">
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 text-white px-4 py-2 text-sm font-medium shadow-lg border-0 whitespace-nowrap">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </motion.div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3
                    className={`text-2xl font-bold text-gray-900 mb-2 ${plan.popular ? "mt-2" : ""}`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <div className="text-left">
                      <div className="text-gray-600">per</div>
                      <div className="text-gray-600">{plan.period}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">billed monthly</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <motion.li
                      key={feature}
                      className="flex items-start gap-3"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  } transition-all duration-300`}
                >
                  {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              No setup fees
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              99.9% uptime SLA
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
