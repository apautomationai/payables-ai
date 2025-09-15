"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer:
      "Start with any plan completely free for 14 days. No credit card required. You'll have full access to all features of your chosen plan. After the trial, you can continue with a paid subscription or downgrade to our free tier.",
  },
  {
    question: "Can I change my plan anytime?",
    answer:
      "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments. There are no penalties for changing plans.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We offer email support for all plans, priority support for Professional plans, and 24/7 dedicated support for Enterprise customers. We also have comprehensive documentation, video tutorials, and a community forum.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take security very seriously. We use bank-grade encryption, are SOC 2 compliant, and regularly undergo security audits. Your data is encrypted in transit and at rest, and we never share it with third parties.",
  },
  {
    question: "Do you offer integrations with other tools?",
    answer:
      "We integrate with over 100+ popular tools including Slack, Google Workspace, Microsoft 365, Salesforce, and many more. Professional and Enterprise plans also include custom integration capabilities.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "We'll notify you when you're approaching your limits. For storage and users, you can easily upgrade your plan. For API calls, we offer flexible add-on packages. We'll never cut off your service without notice.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-sm font-medium border-emerald-200 bg-emerald-50/50 text-emerald-700"
          >
            FAQ
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Frequently asked
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              questions
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Everything you need to know about our platform and services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-lg px-6 hover:shadow-md transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-700 transition-colors duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
