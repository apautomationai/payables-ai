<<<<<<< HEAD
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { SocialProof } from "@/components/landing/social-proof";
import { Pricing } from "@/components/landing/pricing";
import { UseCases } from "@/components/landing/use-cases";
import { About } from "@/components/landing/about";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      <Hero />
      <Features />
      <SocialProof />
      <Pricing />
      <UseCases />
      <About />
      <FAQ />
      <Footer />
    </main>
=======
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Card className="min-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Payables AI Main App</CardTitle>
            <CardDescription>This is the main app for Payables AI</CardDescription>
          </CardHeader>
          <CardContent>
            <p>All the operations are done here</p>
          </CardContent>
          <CardFooter>
            <Button>Get Started</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
>>>>>>> main
  );
}
