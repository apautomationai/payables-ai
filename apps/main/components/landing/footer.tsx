import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  ProfessionalWave,
  FloatingElements,
  GeometricPattern,
  ProfessionalIcons,
} from "./animated-icons";
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
  Heart,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

const navigation = {
  product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Use Cases", href: "#" },
    
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
   
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    // { name: "Status", href: "#" },
    // { name: "Security", href: "#" },
    // { name: "System Status", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Animated Background Elements */}
      <GeometricPattern />
      <FloatingElements />
      <ProfessionalIcons />

      {/* Newsletter Section */}
      <div className="border-b border-gray-800 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your AP Process?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Join hundreds of businesses that have already streamlined their
              accounts payable with Payables.ai
            </p>
            <div className="flex flex-col items-center sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 group">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold text-white">Payables.ai</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              {/* Transform your accounts payable process with AI-powered
              automation. Streamline invoice processing, reduce manual work, and
              improve cash flow management. */}
              Intelligent accounts payable automation for modern businesses.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className="text-xs font-medium border-emerald-600 bg-emerald-900/20 text-emerald-400"
              >
                AI-Powered
              </Badge>
              <Badge
                variant="outline"
                className="text-xs font-medium border-blue-600 bg-blue-900/20 text-blue-400"
              >
                SOC 2 Compliant
              </Badge>
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Section */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2025 Payables.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            Made with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-current mx-1" /> by
            <Link href="https://bluubery.com/" target="_blank">
              Bluubery Technologies
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Wave at Bottom */}
      <ProfessionalWave />
    </footer>
  );
}
