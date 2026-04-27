import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

export const Testimonial = () => (
  <section className="py-24 md:py-32">
    <div className="container max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <Quote className="absolute -top-6 -left-2 h-16 w-16 text-primary/20" />
          <blockquote className="relative text-2xl md:text-3xl font-display font-medium leading-snug">
            "VeritaPep cut our testing cycle from 18 days to 3. That's real money back in our operation — and our customers actually scan the verification codes."
          </blockquote>
          <div className="mt-6 text-sm">
            <div className="font-semibold">Operations Director</div>
            <div className="text-muted-foreground">US-based peptide supplier</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Stat value="48-72hr" label="Average turnaround" />
          <Stat value="99.8%" label="On-time delivery" />
          <Stat value="100%" label="Cryptographically signed" />
          <Stat value="0" label="Customs delays" />
        </div>
      </div>
      <div className="mt-20 rounded-3xl bg-gradient-card border border-primary/30 p-10 md:p-14 text-center shadow-glow">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h3>
        <p className="text-muted-foreground text-lg mb-2">Create your free account and submit your first order in minutes.</p>
        <p className="text-sm mb-8">
          <span className="font-bold text-warning">50% off</span>{" "}
          <span className="text-muted-foreground">your first sample — auto-applies at checkout</span>
        </p>
        <Button size="lg" variant="hero">Create Free Account</Button>
      </div>
    </div>
  </section>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="rounded-xl border border-border bg-card/40 p-6">
    <div className="font-display text-3xl font-bold text-gradient">{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);
