// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Button } from "@workspace/ui/components/button";
// import { Badge } from "@workspace/ui/components/badge";
// import {
//   Menu,
//   X,
//   ChevronDown,
//   CreditCard,
//   ArrowRight,
//   Zap,
//   Users,
//   BarChart3,
//   Shield,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const navigation = [
//   {
//     name: "Features",
//     href: "#features",
//   },
//   { name: "Pricing", href: "#pricing" },
//   { name: "Use Cases", href: "#use-cases" },
//   { name: "About", href: "#about" },
// ];

// export function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled ? "bg-white/50 backdrop-blur-md shadow-lg" : "bg-transparent"
//       }`}
//     >
//       <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
//         <div className="flex items-center justify-between py-4">
//           {/* Logo */}
//           <motion.div
//             className="flex items-center gap-3"
//             whileHover={{ scale: 1.02 }}
//             transition={{ duration: 0.2 }}
//           >
//             <div className="relative">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <CreditCard className="w-6 h-6 text-white" />
//               </div>
//               <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full animate-pulse" />
//             </div>
//             <div>
//               <a
//                 href="/"
//                 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
//               >
//                 Payables.ai
//               </a>
//               <Badge
//                 variant="outline"
//                 className="ml-2 text-xs font-medium border-emerald-200 bg-emerald-50/50 text-emerald-700 px-2 py-0.5"
//               >
//                 AI-Powered
//               </Badge>
//             </div>
//           </motion.div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex lg:items-center lg:gap-8">
//             {navigation.map((item) => (
//               <div key={item.name} className="relative">
//                 <a
//                   href={item.href}
//                   className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 py-2"
//                 >
//                   {item.name}
//                 </a>
//               </div>
//             ))}
//           </div>

//           {/* Desktop CTA Buttons */}
//           <div className="hidden lg:flex lg:items-center lg:gap-4">
//             <Button
//               variant="ghost"
//               className="text-gray-700 hover:text-blue-600 font-medium dark:hover:bg-gray-50 transition-colors duration-300"
//             >
//               <Link href={"/sign-in"}>Sign In</Link>
//             </Button>
//             <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
//               <Link href={"/dashboard"}>Start Free Trial</Link>
//               <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//             </Button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="flex lg:hidden">
//             <button
//               type="button"
//               className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-300"
//               onClick={() => setMobileMenuOpen(true)}
//             >
//               <Menu className="h-6 w-6" aria-hidden="true" />
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <>
//               {/* Backdrop */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
//                 onClick={() => setMobileMenuOpen(false)}
//               />

//               {/* Mobile Menu */}
//               <motion.div
//                 initial={{ x: "100%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "100%" }}
//                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
//                 className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 lg:hidden"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
//                       <CreditCard className="w-5 h-5 text-white" />
//                     </div>
//                     <span className="text-lg font-bold text-gray-900">
//                       Payables.ai
//                     </span>
//                   </div>
//                   <button
//                     type="button"
//                     className="rounded-md p-2.5 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-300"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <X className="h-6 w-6" aria-hidden="true" />
//                   </button>
//                 </div>

//                 <div className="mt-8 flow-root">
//                   <div className="space-y-2">
//                     {navigation.map((item) => (
//                       <div key={item.name}>
//                         <a
//                           href={item.href}
//                           className="block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 transition-colors duration-300"
//                           onClick={() => setMobileMenuOpen(false)}
//                         >
//                           {item.name}
//                         </a>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-8 space-y-4">
//                     <Button
//                       variant="outline"
//                       className="w-full justify-center font-medium"
//                       onClick={() => setMobileMenuOpen(false)}
//                     >
//                       <Link href={"/sign-in"}>Sign In</Link>
//                     </Button>
//                     <Button
//                       className="w-full justify-center bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium shadow-lg"
//                       onClick={() => setMobileMenuOpen(false)}
//                     >
//                       <Link href={"/dashboard"}> Start Free Trial</Link>

//                       <ArrowRight className="ml-2 w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>
//       </nav>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Menu, X, CreditCard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { checkSession } from "./action";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "About", href: "#about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const verifySession = async () => {
      const { isLoggedIn } = await checkSession();
      setIsLoggedIn(isLoggedIn);
    };
    verifySession();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const AuthButtons = () =>
    isLoggedIn ? (
      <Button
        asChild
        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <Link href={"/dashboard"}>
          Go To Dashboard
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </Button>
    ) : (
      <>
        <Button
          asChild
          variant="ghost"
          className="text-gray-700 hover:text-blue-600 font-medium dark:hover:bg-gray-50 transition-colors duration-300"
        >
          <Link href={"/sign-in"}>Sign In</Link>
        </Button>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <Link href={"/sign-up"}>
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </>
    );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Payable.ai
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <AuthButtons />
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div
                className="fixed inset-0 bg-black/25"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm"
              >
                <div className="flex items-center justify-between">
                  <a href="#" className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">
                      Payable.ai
                    </span>
                  </a>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className="py-6 space-y-4">
                      <AuthButtons />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
