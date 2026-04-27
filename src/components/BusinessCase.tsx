import { TrendingUp, BadgeCheck, AlertTriangle } from "lucide-react";

const cases = [
  { icon: TrendingUp, title: "Unlock Your Capital", body: "Every day a batch sits in testing is capital you can't reinvest. Our 48-72 hour turnaround cuts that window from weeks to days." },
  { icon: BadgeCheck, title: "Turn Trust Into Conversion", body: "Embed our verification badge on your product pages. When customers can scan and verify, your credibility becomes a conversion tool." },
  { icon: AlertTriangle, title: "Test Before the FDA Does", body: "Endotoxin contamination isn't hypothetical — it appears in FDA warning letters every quarter. Biosafety testing is liability insurance." },
];

export const BusinessCase = () => (
  <section className="py-24 md:py-32">
    <div className="container">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
        <div>
          <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">The Business Case</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Testing that works for your business.</h2>
          <p className="text-muted-foreground text-lg">Quality isn't just about chemistry. It's about cash flow, competitive positioning, and risk management.</p>
        </div>
        <div className="space-y-4">
          {cases.map((c) => (
            <div key={c.title} className="flex gap-5 p-6 rounded-xl bg-card/40 border border-border hover:border-primary/30 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
