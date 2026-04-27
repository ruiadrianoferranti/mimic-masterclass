import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail } from "lucide-react";
import { Logo } from "./Logo";

export const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="py-24 md:py-32 bg-card/30 border-t border-border/50">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">Get in touch</div>
          <h2 className="text-4xl font-bold mb-3">We typically respond within a few hours.</h2>
          <p className="text-muted-foreground inline-flex items-center gap-2">
            <Mail className="h-4 w-4" /> info@veritapep.labs
          </p>
        </div>
        {sent ? (
          <div className="rounded-2xl bg-gradient-card border border-accent/40 p-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Message sent!</h3>
            <p className="text-muted-foreground">We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="rounded-2xl bg-gradient-card border border-border p-8 space-y-4">
            <Input placeholder="Your name" required className="h-12" />
            <Input type="email" placeholder="Your email" required className="h-12" />
            <Textarea placeholder="Message" rows={5} required />
            <Button type="submit" variant="hero" size="lg" className="w-full">Send message</Button>
          </form>
        )}
      </div>
      <footer className="container mt-24 pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} VeritaPep Labs. All rights reserved.</p>
      </footer>
    </section>
  );
};
