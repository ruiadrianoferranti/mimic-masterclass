import { CheckCircle2, XCircle } from "lucide-react";

const oldWay = [
  "No connection to original lab data",
  "Batch numbers recycled across shipments",
  "No link between document and vial",
  "Chromatograms impossible to authenticate",
  "Customers must trust — they can't verify",
];

const newWay = [
  "Live record rendered directly from our LIMS",
  "Cryptographically signed and timestamped",
  "Tamper-proof — even we can't alter results",
  "Interactive chromatogram viewer",
  "Scan to verify — proof, not trust",
];

export const TrustProblem = () => (
  <section id="trust" className="py-24 md:py-32">
    <div className="container">
      <div className="text-center mb-14 max-w-3xl mx-auto">
        <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">The Trust Problem</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">The Industry Runs on Trust. The Testing Doesn't.</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          A certificate of analysis is supposed to be proof. But in this industry, it's just a claim — one that can be edited, recycled, or fabricated without your customers ever knowing. Batch numbers get reused for years. Chromatograms get manipulated. "Golden samples" get tested while bulk inventory ships untouched. Your reputation is only as good as the verification behind it.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8">
          <div className="text-xs font-mono uppercase tracking-widest text-destructive mb-2">The Old Way</div>
          <h3 className="text-2xl font-bold mb-6">Unverifiable COA</h3>
          <ul className="space-y-3">
            {oldWay.map((t) => (
              <li key={t} className="flex gap-3 text-sm text-foreground/80">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 shadow-soft">
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">The HelixAnalyticals Way</div>
          <h3 className="text-2xl font-bold mb-6">VeritaVerified COA</h3>
          <ul className="space-y-3">
            {newWay.map((t) => (
              <li key={t} className="flex gap-3 text-sm text-foreground/90">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 max-w-5xl mx-auto rounded-3xl bg-gradient-verify border border-border p-8 md:p-12">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">The Verified Record — Plus a PDF for Your Files</h3>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Every HelixAnalyticals report lives at a unique, cryptographically signed URL — that's the authoritative record. We also generate the cleanest PDF COA in the industry for your archives and downstream distribution. Every order ships with both.
        </p>
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          <CoaCard digital />
          <div className="text-3xl font-light text-muted-foreground text-center">+</div>
          <CoaCard />
        </div>
      </div>
    </div>
  </section>
);

const CoaCard = ({ digital = false }: { digital?: boolean }) => (
  <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
    <div className="flex items-center justify-between mb-4">
      <div className="text-xs font-mono uppercase tracking-wider text-primary">
        {digital ? "HelixVerify™ Digital COA" : "PDF COA"}
      </div>
      <span className="text-xs font-bold text-accent">CONFORMS</span>
    </div>
    <div className="text-sm font-semibold mb-1">TB500 (17-23 Fragment)</div>
    <div className="text-xs text-muted-foreground mb-4">Harmony Peptide · TB10 · LOT TB10HYBCBC</div>
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div className="rounded-lg bg-secondary/60 p-2">
        <div className="text-muted-foreground">Purity</div>
        <div className="font-bold">99.77%</div>
      </div>
      <div className="rounded-lg bg-secondary/60 p-2">
        <div className="text-muted-foreground">Identity</div>
        <div className="font-bold text-[10px]">TB500</div>
      </div>
      <div className="rounded-lg bg-secondary/60 p-2">
        <div className="text-muted-foreground">Quantity</div>
        <div className="font-bold">10.08 mg</div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
      <span className="font-mono">8Z8G-MRJB</span>
      <span>{digital ? "Live • Verified" : "Print • Archive"}</span>
    </div>
  </div>
);
