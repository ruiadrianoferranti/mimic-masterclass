import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Mail, Clock, MapPin } from "lucide-react";

const ContactPage = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-16">
      <section className="py-20 md:py-28 bg-gradient-verify border-b border-border">
        <div className="container max-w-4xl text-center">
          <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">Contact</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">Questions about testing, verification, or onboarding? We respond within a few hours.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl grid md:grid-cols-3 gap-5">
          {[
            { icon: Mail, t: "Email", v: "info@veritapeplabs.com" },
            { icon: Clock, t: "Response Time", v: "Within 4 business hours" },
            { icon: MapPin, t: "Laboratory", v: "United States" },
          ].map((c) => (
            <div key={c.t} className="rounded-xl bg-card border border-border p-6 text-center shadow-soft">
              <c.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{c.t}</div>
              <div className="font-semibold">{c.v}</div>
            </div>
          ))}
        </div>
      </section>

      <ContactForm />
    </main>
    <Footer />
  </div>
);

export default ContactPage;
