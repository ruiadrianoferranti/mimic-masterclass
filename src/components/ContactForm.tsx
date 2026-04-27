import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail } from "lucide-react";

export const ContactForm = () => {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="py-20 md:py-28 bg-secondary/30 border-t border-border">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Get in touch</h2>
          <p className="text-muted-foreground inline-flex items-center gap-2">
            <Mail className="h-4 w-4" /> info@veritapeplabs.com — we typically respond within a few hours.
          </p>
        </div>
        {sent ? (
          <div className="rounded-2xl bg-card border border-accent/40 p-10 text-center shadow-soft">
            <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Message sent!</h3>
            <p className="text-muted-foreground">We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="rounded-2xl bg-card border border-border p-8 space-y-4 shadow-soft">
            <Input placeholder="Your name" required className="h-12" />
            <Input type="email" placeholder="Your email" required className="h-12" />
            <Textarea placeholder="Message" rows={5} required />
            <Button type="submit" variant="hero" size="lg" className="w-full">Send message</Button>
          </form>
        )}
      </div>
    </section>
  );
};
