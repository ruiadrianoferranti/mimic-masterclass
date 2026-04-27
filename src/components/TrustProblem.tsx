import { ShieldX, ShieldCheck, Check, X } from "lucide-react";

const oldWay = [
  "No connection to original lab data",
  "Batch numbers recycled across shipments",
  "No link between document and vial",
  "Chromatograms impossible to authenticate",
  "Customers must trust—they can't verify",
];

const newWay = [
  "Live record rendered directly from our LIMS",
  "Cryptographically signed and timestamped",
  "Tamper-proof — even we can't alter results",
  "Interactive chromatogram viewer",
  "Scan to verify—proof, not trust",
];

export const TrustProblem = () => {
  return (
    <section id="trust" className="py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-mono tracking-widest text-primary uppercase mb-4">
            The Trust Problem
          </div>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            The industry runs on trust.
            <br />
            <span className="text-muted-foreground">The testing doesn't.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A certificate of analysis is supposed to be proof. But too often it's
            just a claim — one that can be edited, recycled, or fabricated without
            customers ever knowing. Your reputation is only as good as the
            verification behind it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <Card tag="The Old Way" title="Unverifiable COA" items={oldWay} icon={ShieldX} negative />
          <Card tag="The VeritaPep Way" title="VeritaVerified COA" items={newWay} icon={ShieldCheck} />
        </div>
      </div>
    </section>
  );
};

const Card = ({ tag, title, items, icon: Icon, negative = false }: { tag: string; title: string; items: string[]; icon: any; negative?: boolean; }) => (
  <div className={`relative rounded-2xl border p-8 ${negative ? "border-border bg-card/40" : "border-primary/40 bg-gradient-card shadow-glow"}`}>
    <div className="flex items-center gap-3 mb-2">
      <Icon className={`h-6 w-6 ${negative ? "text-muted-foreground" : "text-primary"}`} />
      <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">{tag}</span>
    </div>
    <h3 className={`text-2xl font-bold mb-6 ${negative ? "text-muted-foreground" : ""}`}>{title}</h3>
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-3 text-sm">
          {negative ? <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" /> : <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />}
          <span className={negative ? "text-muted-foreground" : "text-foreground/90"}>{it}</span>
        </li>
      ))}
    </ul>
  </div>
);
