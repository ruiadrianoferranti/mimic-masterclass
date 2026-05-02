import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustProblem } from "@/components/TrustProblem";
import { Pillars } from "@/components/Pillars";
import { BusinessCase } from "@/components/BusinessCase";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonial } from "@/components/Testimonial";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
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
};

export default Index;
