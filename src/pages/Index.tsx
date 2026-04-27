import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustProblem } from "@/components/TrustProblem";
import { Pillars } from "@/components/Pillars";
import { BusinessCase } from "@/components/BusinessCase";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonial } from "@/components/Testimonial";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

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
      <ContactForm />
    </main>
    <Footer />
  </div>
);

export default Index;
