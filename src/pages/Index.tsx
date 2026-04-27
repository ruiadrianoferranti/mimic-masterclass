import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustProblem } from "@/components/TrustProblem";
import { Pillars } from "@/components/Pillars";
import { BusinessCase } from "@/components/BusinessCase";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonial } from "@/components/Testimonial";
import { Contact } from "@/components/Contact";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <Hero />
      <TrustProblem />
      <Pillars />
      <BusinessCase />
      <HowItWorks />
      <Testimonial />
      <Contact />
    </main>
  </div>
);

export default Index;
