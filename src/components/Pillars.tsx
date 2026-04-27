import { Lock, Zap, FlaskConical } from "lucide-react";

const pillars = [
  { n: "01", icon: Lock, title: "Immutable Verification", body: "Every report lives at a unique URL, rendered live from our LIMS — not a downloadable file. Data is cryptographically hashed and securely stored.", cta: "See verification portal" },
  { n: "02", icon: Zap, title: "48-72 Hour Turnaround", body: "International shipping and customs holds lock your capital for weeks. We're US-based with optimized workflows. Ship Monday, results Wednesday.", cta: "See how it works" },
  { n: "03", icon: FlaskConical, title: "Biosafety Profiling", body: "A peptide can be 99% pure and still be loaded with bacterial endotoxins or heavy metals. We test what HPLC misses.", cta: "View testing tiers" },
];

export const Pillars = () => (
  <section id="services" className="py-24 md:py-32 bg-card/30 border-y border-border/50">
    <div className="container">
      <div className="text-center mb-16">
        <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">Why VeritaPep</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Three Pillars of Better Testing</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">We built VeritaPep around what actually matters to your business.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <div key={p.n} className="group relative rounded-2xl bg-gradient-card border border-border p-8 hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-glow">
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <p.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">Pillar {p.n}</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{p.body}</p>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">{p.cta} <span aria-hidden>→</span></a>
          </div>
        ))}
      </div>
    </div>
  </section>
);
