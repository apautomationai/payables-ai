import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { ComingSoon } from "@/components/landing/upcoming";
import { SocialProof } from "@/components/landing/social-proof";
import { Pricing } from "@/components/landing/pricing";
import { UseCases } from "@/components/landing/use-cases";
import { About } from "@/components/landing/about";
import { Founders } from "@/components/landing/founders";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      <Hero />
      <Features />
      <ComingSoon />
      <SocialProof />
      <Pricing />
      <UseCases />
      <About />
      <Founders />
      <FAQ />
      <Footer />
    </main>
  );
}
