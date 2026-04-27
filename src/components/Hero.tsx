import { Button } from "@/components/ui/button";
import { Tag, ShieldCheck, Clock, MapPin } from "lucide-react";
import heroImg from "@/assets/hero-lab.jpg";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-end pt-16">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Laboratory vials in dramatic lighting"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/95" />
      </div>

      <div className="container relative pb-24 pt-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-foreground/90">Now accepting new clients</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-8">
            Peptide Testing,
            <br />
            <span className="text-gradient">Verified.</span>
          </h1>

          <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 md:p-8 mb-8 max-w-xl shadow-elegant">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              48-72 hour turnaround. Independent verification. Biosafety assays
              others omit. Built for suppliers who stake their reputation on
              accuracy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button size="lg" variant="hero">Start Testing</Button>
            <Button size="lg" variant="success">Verify a Report</Button>
            <Button size="lg" variant="glass">See Example COA</Button>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-2">
            <Tag className="h-4 w-4 text-warning" />
            <span className="text-sm">
              <span className="font-bold text-warning">50% OFF</span>{" "}
              <span className="text-foreground/80">your first sample —</span>{" "}
              <a href="#" className="underline underline-offset-2 hover:text-warning transition-colors">claim now</a>
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 bg-card/40 backdrop-blur">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <Stat icon={ShieldCheck} label="ISO 17025" sub="Pending" />
          <Stat icon={Clock} label="48-72 Hour" sub="Standard TAT" />
          <Stat icon={MapPin} label="US-Based" sub="Laboratory" />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ icon: Icon, label, sub }: { icon: any; label: string; sub: string }) => (
  <div className="flex items-center gap-4 justify-center md:justify-start">
    <div className="h-11 w-11 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <div className="font-display font-semibold">{label}</div>
      <div className="text-sm text-muted-foreground">{sub}</div>
    </div>
  </div>
);
