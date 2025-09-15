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
    role: "CTO at TechFlow",
    company: "TechFlow",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    content:
      "This platform has completely transformed how we manage our operations. The automation features saved us 20+ hours per week.",
    rating: 5,
    metrics: "20+ hours saved weekly",
  },
  {
    name: "Michael Rodriguez",
    role: "VP of Operations",
    company: "ScaleUp Inc",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    content:
      "The analytics dashboard gives us insights we never had before. Our decision-making has become much more data-driven.",
    rating: 5,
    metrics: "40% better decisions",
  },
  {
    name: "Emily Johnson",
    role: "Product Manager",
    company: "InnovateLab",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    content:
      "The collaboration features are incredible. Our remote team feels more connected than ever before.",
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
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Company Logos */}
        <motion.div
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-sm font-medium border-blue-200 bg-blue-50/50 text-blue-700"
          >
            Testimonials
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Loved by
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              thousands{" "}
            </span>
            of teams
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
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
              <Card className="p-8 h-full dark:bg-white bg-white dark:border-gray-200 border-gray-200 hover:shadow-lg transition-shadow duration-300 relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100" />

                {/* Animated corner orb */}
                <div className="absolute top-2 left-2 opacity-0 hover:opacity-30 transition-opacity duration-300">
                  <PulsingOrb color="#10B981" size={20} />
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

                <blockquote className="text-gray-700 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-emerald-100 text-emerald-700 border-emerald-200"
                >
                  {testimonial.metrics}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
