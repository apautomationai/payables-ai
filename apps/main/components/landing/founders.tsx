"use client";

import { motion } from "framer-motion";
import { Card } from "@workspace/ui/components/card";
import {
  Users,
  Rocket,
  Handshake,
  ArrowRight,
  Linkedin,
  Mail,
} from "lucide-react";
import { PulsingOrb, AnimatedUsers, AnimatedWorkflow } from "./animated-icons";
import Image from "next/image";

export function Founders() {
  const founders = [
    {
      name: "Davis Cannon",
      role: "Product Leader",
      description:
        "Years of experience building AI platforms and financial software",
      image: "/images/Davis.jpg", // Replace with actual image path
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      linkedin: "#",
      email: "davis@getsledge.com",
    },
    {
      name: "Matteo Miralaie",
      role: "Engineering Expert",
      description:
        "Passionate about creating tech that solves real business problems",
      image: "/images/Matteo.jpg", // Replace with actual image path
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      linkedin: "#",
      email: "matteo@getsledge.com",
    },
    {
      name: "Raz Danoukh",
      role: "Industry Specialist",
      description:
        "Deep relationships in construction, contracting, and business operations",
      image: "/images/Raz.jpg", // Replace with actual image path
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      linkedin: "#",
      email: "raz@getsledge.com",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Diamond plate texture - ROUGHER */}
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px),
                         repeating-linear-gradient(-45deg, #FDB022 0, #FDB022 2px, transparent 0, transparent 40px)`,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <PulsingOrb color="#FDB022" size={120} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <PulsingOrb color="#F59E0B" size={100} />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
        <AnimatedUsers />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-1 rounded-2xl inline-block mb-6">
            <div className="bg-gray-900 p-2 rounded-xl">
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6 uppercase">
            Our{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Founders
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            SLEDGE was founded by a team of passionate experts with decades of
            combined experience in AI technology, software engineering, and
            industry operations.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 rounded-lg shadow-lg shadow-yellow-500/50 border-2 border-yellow-600 font-bold uppercase"
          >
            <Handshake className="h-5 w-5 mr-2" />
            <span>Meet the Team Behind Our Success</span>
          </motion.div>
        </motion.div>

        {/* Founders Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full bg-gradient-to-br from-gray-900 to-black border-8 border-gray-600 hover:border-yellow-600/70 shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(253,176,34,0.5),inset_0_0_30px_rgba(0,0,0,0.6)] transition-all duration-300 group relative overflow-hidden rounded-none">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 ${founder.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                {/* Founder Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-emerald-100 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {/* Placeholder for actual image - replace with Image component when images are available
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {founder.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div> */}
                      {/* Uncomment and use when you have actual images */}
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        width={128}
                        height={128}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Decorative orb */}
                  <div className="absolute -top-2 -right-2">
                    <PulsingOrb
                      color={founder.color.replace("text-", "")}
                      size={30}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2 uppercase">
                    {founder.name}
                  </h3>
                  <p className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-3">
                    {founder.role}
                  </p>
                  <p className="text-gray-300 mb-6">{founder.description}</p>

                  <div className="flex justify-center space-x-3">
                    <motion.a
                      href={founder.linkedin}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-yellow-500/20 text-yellow-500 rounded-full hover:bg-yellow-500/30 border-2 border-yellow-600/40 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </motion.a>
                    {/* <motion.a
                      href={`mailto:${founder.email}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                    </motion.a> */}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
