"use client";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import { PulsingOrb } from "./animated-icons";
import {
  CheckCircle,
  Star,
  Zap,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Define the type for pricing plans
interface PricingPlan {
  name: string;
  price: number | null;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
  customPricing?: boolean;
  enterprise?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 50 invoices/month",
      "Basic AI processing",
      "Email listener (Gmail)",
      "Basic analytic",
      "1 user",
    ],
    popular: false,
    cta: "Start",
  },
  {
    name: "Pro",
    price: 299,
    period: "month",
    description: "Ideal for growing businesses",
    features: [
      "Up to 500 invoices/month",
      "Advanced AI processing",
      "Multi-email provider support",
      "Priority support",
      "Advanced analytics",
      "Custom approval workflows",
      "API access",
      "Up to 5 users",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Teams",
    price: 699,
    period: "month",
    description: "For large teams with complex needs",
    features: [
      "Up to 2,000 invoices/month",
      "Advanced AI processing",
      "All email providers",
      "24/7 dedicated support",
      "Advanced analytics",
      "Custom approval workflows",
      "API access",
      "Up to 20 users",
      "Team collaboration tools",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: null,
    period: "month",
    description: "For organizations with complex requirements",
    features: [
      "Unlimited invoices",
      "Custom integrations",
      "Unlimited users",
      "Custom AI models",
      "White-label options",
      "Custom training",
      "24/7 dedicated support",
      "On-premise deployment",
      "Priority onboarding",
    ],
    popular: false,
    cta: "Contact Sales",
    customPricing: true,
    enterprise: true,
  },
];

export function Pricing() {
  // Safely get the enterprise plan
  const enterprisePlan = pricingPlans.find((plan) => plan.enterprise);

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-gray-800 via-gray-900 to-black relative overflow-hidden">
      {/* Diamond plate texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 1px, transparent 0, transparent 50%),
                         repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 1px, transparent 0, transparent 50%)`,
        backgroundSize: '12px 12px'
      }} />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-sm font-medium border-yellow-600 bg-yellow-500/20 text-yellow-400 uppercase"
          >
            Pricing
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl uppercase">
            Simple,
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}
              transparent{" "}
            </span>
            pricing
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-300">
            Choose the perfect plan for your business needs. All plans include a
            14-day free trial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pricingPlans
            .filter((plan) => !plan.enterprise)
            .map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
  className={`relative p-8 h-full flex flex-col ${
    plan.popular
      ? "border-4 border-yellow-600 shadow-2xl shadow-yellow-500/30 ring-2 ring-yellow-500/50 scale-105"
      : "border-4 border-gray-700 hover:border-yellow-600/50 hover:shadow-lg hover:shadow-yellow-500/20"
  } transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden`}
>
  {/* Corner screws/rivets */}
  <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>

  {/* Animated background for popular plan */}
  {plan.popular && (
    <div className="absolute top-4 right-4 opacity-20">
      <PulsingOrb color="#FDB022" size={40} />
    </div>
  )}

  {/* Corner orbs for all plans */}
  <div className="absolute bottom-4 left-4 opacity-0 hover:opacity-30 transition-opacity duration-300">
    <PulsingOrb color="#F59E0B" size={25} />
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
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-4 py-2 text-sm font-bold shadow-lg shadow-yellow-500/50 border-2 border-yellow-600 whitespace-nowrap uppercase">
          <Star className="w-4 h-4 mr-1 fill-current" />
          Most Popular
        </Badge>
      </motion.div>
    </div>
  )}

  {/* Content wrapper that grows to fill available space */}
  <div className="flex-grow">
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-white mb-2 uppercase">
        {plan.name}
      </h3>
      <p className="text-gray-300 mb-4">{plan.description}</p>

      <div className="flex items-center justify-center gap-2 mb-2">
        <ul>
          <li>
            <span className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ${plan.price}
            </span>
            <div className="text-left flex flex-row gap-1">
              <div className="text-gray-400">/per</div>
              <div className="text-gray-400">{plan.period}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <ul className="space-y-4 mb-8">
      {plan.features.map((feature) => (
        <li key={feature}>
          <motion.div
            className="flex items-start gap-3"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">{feature}</span>
          </motion.div>
        </li>
      ))}
    </ul>
  </div>

  {/* Button container that stays at the bottom */}
  <div className="mt-auto">
    <Button
      size="lg"
      className={`w-full ${
        plan.popular
          ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 shadow-lg shadow-yellow-500/50 border-2 border-yellow-600 font-bold uppercase"
          : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 hover:border-yellow-600/50 font-medium uppercase"
      } transition-all duration-300`}
    >
      {plan.popular && <Zap className="w-4 h-4 mr-2" />}
      {plan.cta}
    </Button>
  </div>
</Card>
              </motion.div>
            ))}

          {/* Enterprise Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-2 xl:col-span-3"
          >
            <Card className="relative p-10 border-4 border-yellow-600/50 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden shadow-2xl shadow-yellow-500/20">
              {/* Corner screws/rivets */}
              <div className="absolute -top-2 -left-2 w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
              <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
              <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-500 z-20"></div>
              
              {/* Background elements */}
              <div className="absolute top-0 right-0 opacity-10">
                <PulsingOrb color="#FDB022" size={120} />
              </div>
              <div className="absolute bottom-0 left-0 opacity-10">
                <PulsingOrb color="#F59E0B" size={100} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                {/* Left side - Header and description */}
                <div>
                  <div className="flex items-center mb-6">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-4 py-2 text-sm font-bold shadow-lg border-2 border-yellow-600 mr-4 uppercase">
                      <Building2 className="w-4 h-4 mr-1" />
                      Enterprise Grade
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-yellow-600 text-yellow-400 bg-yellow-500/20 uppercase font-bold"
                    >
                      Custom Pricing
                    </Badge>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-4 uppercase">
                    Enterprise Solution
                  </h2>
                  <h3 className="text-xl text-yellow-400 font-semibold mb-2">
                    For organizations with complex requirements
                  </h3>

                  <p className="text-gray-300 mb-8 text-lg">
                    Tailored solutions for large enterprises with custom needs
                    and advanced requirements.
                  </p>

                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-sm border-4 border-yellow-600/40 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2 uppercase">
                        Custom Pricing
                      </div>
                      <p className="text-gray-300">
                        Tailored to your specific needs
                      </p>
                    </div>
                  </div>

                  <Link href="/contact-us">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-400/60 transition-all duration-300 group border-2 border-yellow-600 font-bold uppercase"
                  >
                   
                    Contact Sales
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  </Link>
                </div>

                {/* Right side - Features */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-6 border-b-2 border-yellow-600/40 pb-2 uppercase">
                    Everything Included:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enterprisePlan?.features.map((feature) => (
                      <motion.div
                        key={feature}
                        className="flex items-start p-3 bg-gray-700/50 rounded-lg border-2 border-gray-600 hover:border-yellow-600/50 shadow-sm hover:shadow-md hover:shadow-yellow-500/20 transition-all"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5 mr-3" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border-2 border-yellow-600/40">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-300">
                          <span className="font-bold text-yellow-400">
                            Dedicated account manager
                          </span>{" "}
                          and personalized onboarding included
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
        </motion.div> */}
      </div>
    </section>
  );
}
