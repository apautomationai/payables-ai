"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { PulsingOrb } from "./animated-icons";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    // role: "CTO at TechFlow",
    company: "Ferrocrete Construction",
    image: "/images/logos/Builder.jpg",
    content:
      "Before SLEDGE, we were drowning in invoices from subs and suppliers. Now everything flows straight from email into our accounting system — no more lost paperwork, no more late payments.",
    rating: 5,
    metrics: "20+ hours saved weekly",
  },
  {
    name: "Michael Rodriguez",
    // role: "VP of Operations",
    company: "King Genomics",
    image: "/images/logos/king.png",
    content:
      "We handle dozens of specialized vendor invoices each month. SLEDGE makes it effortless to log, track, and pay — our finance team saves hours every week",
    rating: 5,
    metrics: "40% better decisions",
  },
  {
    name: "Emily Johnson",
    // role: "Product Manager",
    company: "Emily Delgado’s Nails",
    image: "/images/logos/Emily.png",
    content:
      "Running a salon means juggling clients and suppliers. SLEDGE keeps all my product invoices organized, and I can see exactly what’s due without the stress.",
    rating: 5,
    metrics: "60% better collaboration",
  },
];

const companies = [
  { name: "TechFlow", logo: "TF" },
  { name: "ScaleUp", logo: "SU" },
  { name: "InnovateLab", logo: "IL" },
  { name: "DataSync", logo: "DS" },
  { name: "CloudTech", logo: "CT" },
  { name: "FutureCorp", logo: "FC" },
];

export function SocialProof() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Diamond plate texture - ROUGHER */}
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px),
                         repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Company Logos */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-gray-600 mb-8">
            Trusted by industry leaders worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {companies.map((company) => (
              <motion.div
                key={company.name}
                className="flex items-center justify-center relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                  <PulsingOrb color="#3B82F6" size={15} />
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-sm">
                  {company.logo}
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {company.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

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
            Testimonials
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl uppercase">
            Loved by
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}
              thousands{" "}
            </span>
            of teams
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-300">
            See what our customers say about transforming their business
            operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-gray-900 to-black border-8 border-gray-600 hover:border-yellow-600/70 hover:shadow-[0_0_40px_rgba(253,176,34,0.5),inset_0_0_30px_rgba(0,0,0,0.6)] transition-all duration-300 relative rounded-none">
                {/* Corner screws/rivets - LARGER AND ROUGHER */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                
                {/* Weld marks */}
                <div className="absolute top-4 left-1/4 w-16 h-1 bg-yellow-600/40 blur-[2px]"></div>
                <div className="absolute bottom-4 right-1/4 w-14 h-1 bg-yellow-600/40 blur-[2px]"></div>
                
                <Quote className="absolute top-6 right-6 w-8 h-8 text-yellow-500/20" />

                {/* Animated corner orb */}
                <div className="absolute top-2 left-2 opacity-0 hover:opacity-30 transition-opacity duration-300">
                  <PulsingOrb color="#FDB022" size={20} />
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                <blockquote className="text-gray-300 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-yellow-600/40">
                    <AvatarImage src={testimonial.image} alt={"photo"} />
                    {/* <AvatarFallback className="bg-yellow-500/20 text-yellow-400 font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback> */}
                  </Avatar>
                  <div>
                    {/* <div className="font-semibold text-white">
                      {testimonial.name}
                    </div> */}
                    {/* <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div> */}
                    <div className="text-sm font-medium text-yellow-400">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-emerald-100 dark:hover:bg-gray-50 text-emerald-700 border-emerald-200"
                >
                  {testimonial.metrics}
                </Badge> */}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
