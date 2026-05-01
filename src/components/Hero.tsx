import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tag, ShieldCheck, Clock, MapPin } from "lucide-react";
import heroImg from "@/assets/hero-lab.jpg";
import { SignUpModal } from "./SignUpModal";

const isLoggedIn = () => !!localStorage.getItem("helix_user");

const StartTestingButton = () => {
  const navigate = useNavigate();
  if (isLoggedIn()) {
    return (
      <Button size="lg" variant="hero" onClick={() => navigate("/services")}>
        Start Testing
      </Button>
    );
  }
  return <SignUpModal trigger={<Button size="lg" variant="hero">Start Testing</Button>} />;
};

const OfferBanner = () => {
  const navigate = useNavigate();
  if (isLoggedIn()) {
    return (
      <button
        onClick={() => navigate("/services")}
        className="inline-flex items-center gap-2 rounded-full border border-warning/60 bg-warning/15 backdrop-blur px-4 py-2 hover:bg-warning/25 transition-colors cursor-pointer"
      >
        <Tag className="h-4 w-4 text-warning" />
        <span className="text-sm text-white">
          <span className="font-bold text-warning">50% OFF</span>{" "}
          <span className="text-white/90">your first sample —</span>{" "}
          <span className="underline underline-offset-2 hover:text-warning transition-colors">claim now</span>
        </span>
      </button>
    );
  }
  return (
    <SignUpModal
      trigger={
        <button className="inline-flex items-center gap-2 rounded-full border border-warning/60 bg-warning/15 backdrop-blur px-4 py-2 hover:bg-warning/25 transition-colors cursor-pointer">
          <Tag className="h-4 w-4 text-warning" />
          <span className="text-sm text-white">
            <span className="font-bold text-warning">50% OFF</span>{" "}
            <span className="text-white/90">your first sample —</span>{" "}
            <span className="underline underline-offset-2 hover:text-warning transition-colors">claim now</span>
          </span>
        </button>
      }
    />
  );
};

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-end pt-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Peptide vials in a US-based laboratory"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/40 to-slate-900/80" />
      </div>

      <div className="container relative z-10 pb-20 pt-32">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.05] mb-8 text-white">
            Peptide Testing, <span className="text-primary-foreground bg-clip-text" style={{ backgroundImage: "var(--gradient-primary)", WebkitBackgroundClip: "text", color: "transparent" }}>Verified.</span>
          </h1>

          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-7 mb-8 max-w-xl">
            <p className="text-base md:text-lg text-white/95 leading-relaxed">
              48-72 hour turnaround. Independent verification. Biosafety assays others omit. Built for suppliers who stake their reputation on accuracy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <StartTestingButton />
            <Button size="lg" variant="success" asChild><Link to="/verify">Verify a Report</Link></Button>
            <Button size="lg" variant="glass" asChild><a href="/verify-report/8Z8G-MRJB">See Example COA</a></Button>
          </div>
          <OfferBanner />
        </div>
      </div>

      <div className="relative z-10 border-t border-border bg-card">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 py-7">
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
