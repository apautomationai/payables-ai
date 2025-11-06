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
    question: "How much does SLEDGE cost?",
    answer:
      "We offer flexible pricing tiers. Our Free plan gets you started, Pro is $299/month, Teams is $699/month, and Enterprise pricing is custom. You only pay for what your business needs.",
  },
  {
    question:
      "Does SLEDGE integrate with QuickBooks and other accounting platforms?",
    answer:
      "Yes. SLEDGE integrates seamlessly with QuickBooks, and we’re adding support for more platforms like Xero and Sage soon.",
  },
  {
    question: "Can I pay vendors directly through SLEDGE?",
    answer:
      "Yes. Once invoices are logged, you can pay vendors securely from the platform — no extra steps or tools required.",
  },
  {
    question: "Who should use SLEDGE?",
    answer:
      "SLEDGE is built for builders, contractors, subcontractors, and small businesses who want to save time and reduce errors in handling invoices.",
  },
  {
    question: "How does SLEDGE capture invoices from email?",
    answer:
      "Our AI email scanner connects to Gmail and Outlook to automatically pull invoices from your inbox — no more manual uploads.",
  },
  {
    question:
      "What makes SLEDGE different from other accounts payable software?",
    answer:
      "SLEDGE is built specifically for trades and small businesses. We combine AI invoice capture, auto-parsing, and direct payouts in one simple tool.",
  },
  {
    question: "Is SLEDGE secure?",
    answer:
      "Yes. We use enterprise-grade encryption, and your data is never shared with third parties.",
  },
  {
    question: "What if my business grows or I add more team members?",
    answer:
      "SLEDGE scales with your needs. You can upgrade tiers anytime and invite your team or subcontractors to collaborate with proper permissions.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Diamond plate texture - ROUGHER */}
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px),
                         repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-sm font-medium border-yellow-600 bg-yellow-500/20 text-yellow-400 uppercase"
          >
            FAQ
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl uppercase">
            Frequently asked
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}
              questions
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-300">
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
                className="bg-gradient-to-br from-gray-900 to-black border-8 border-gray-600 hover:border-yellow-600/70 rounded-none px-6 hover:shadow-[0_0_40px_rgba(253,176,34,0.5),inset_0_0_30px_rgba(0,0,0,0.6)] transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-white hover:text-yellow-400 transition-colors duration-300 uppercase">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed pt-2">
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
