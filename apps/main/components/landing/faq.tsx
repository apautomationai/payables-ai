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
    question: "How much does Payables cost?",
    answer:
      "We offer flexible pricing tiers. Our Free plan gets you started, Pro is $299/month, Teams is $699/month, and Enterprise pricing is custom. You only pay for what your business needs.",
  },
  {
    question:
      "Does Payables integrate with QuickBooks and other accounting platforms?",
    answer:
      "Yes. Payables integrates seamlessly with QuickBooks, and we’re adding support for more platforms like Xero and Sage soon.",
  },
  {
    question: "Can I pay vendors directly through Payables?",
    answer:
      "Yes. Once invoices are logged, you can pay vendors securely from the platform — no extra steps or tools required.",
  },
  {
    question: "Who should use Payables?",
    answer:
      "Payables is built for builders, contractors, subcontractors, and small businesses who want to save time and reduce errors in handling invoices.",
  },
  {
    question: "How does Payables capture invoices from email?",
    answer:
      "Our AI email scanner connects to Gmail and Outlook to automatically pull invoices from your inbox — no more manual uploads.",
  },
  {
    question:
      "What makes Payables different from other accounts payable software?",
    answer:
      "Payables is built specifically for trades and small businesses. We combine AI invoice capture, auto-parsing, and direct payouts in one simple tool.",
  },
  {
    question: "Is Payables secure?",
    answer:
      "Yes. We use enterprise-grade encryption, and your data is never shared with third parties.",
  },
  {
    question: "What if my business grows or I add more team members?",
    answer:
      "Payables scales with your needs. You can upgrade tiers anytime and invite your team or subcontractors to collaborate with proper permissions.",
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
