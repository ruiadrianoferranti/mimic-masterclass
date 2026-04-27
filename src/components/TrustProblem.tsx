import { useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck, FileText, QrCode, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

export const TrustProblem = () => {
  const [open, setOpen] = useState<null | "digital" | "pdf">(null);

  return (
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
            <h3 className="text-2xl font-bold mb-6">HelixVerified COA</h3>
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
            <button onClick={() => setOpen("digital")} className="group text-left">
              <DigitalCoa />
            </button>
            <div className="text-3xl font-light text-muted-foreground text-center">+</div>
            <button onClick={() => setOpen("pdf")} className="group text-left">
              <PdfCoa />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">{open === "digital" ? "Digital COA Preview" : "PDF COA Preview"}</DialogTitle>
          <div className="bg-card rounded-xl overflow-hidden shadow-elegant">
            {open === "digital" ? <DigitalCoa expanded /> : <PdfCoa expanded />}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

/* ----------------- Digital COA mockup ----------------- */
const DigitalCoa = ({ expanded = false }: { expanded?: boolean }) => (
  <div className={`rounded-2xl bg-card border border-border shadow-soft overflow-hidden transition-all ${!expanded && "group-hover:shadow-elegant group-hover:-translate-y-1"}`}>
    {/* Browser chrome */}
    <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/80 border-b border-border">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
      </div>
      <div className="ml-2 flex-1 truncate text-[10px] font-mono text-muted-foreground bg-background rounded px-2 py-1 border border-border">
        helixanalyticals.com/verify-report/8Z8G-MRJB
      </div>
      {!expanded && <Maximize2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />}
    </div>

    {/* Header bar */}
    <div className="bg-gradient-primary px-5 py-3 flex items-center justify-between text-white">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-xs font-mono uppercase tracking-wider font-semibold">HelixVerify Digital COA</span>
      </div>
      <span className="text-[10px] font-bold bg-white/20 backdrop-blur px-2 py-0.5 rounded">VERIFIED</span>
    </div>

    <div className={`p-5 ${expanded ? "p-8" : ""}`}>
      <div className="text-base font-bold mb-1">TB500 (17-23 Fragment)</div>
      <div className="text-xs text-muted-foreground mb-4">Harmony Peptide · TB10 · LOT TB10HYBCBC</div>

      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
        <Metric label="Purity" value="99.77%" />
        <Metric label="Identity" value="TB500" />
        <Metric label="Quantity" value="10.08 mg" />
      </div>

      {/* Chromatogram */}
      <div className="rounded-lg border border-border bg-secondary/40 p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">HPLC Chromatogram</span>
          <span className="text-[10px] font-mono text-accent">Peak: 99.77%</span>
        </div>
        <svg viewBox="0 0 300 80" className="w-full h-auto">
          <defs>
            <linearGradient id="chromaGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,75 L40,73 L70,71 L95,72 L110,68 L130,55 L145,12 L160,55 L175,70 L200,68 L230,72 L260,71 L300,73 L300,80 L0,80 Z" fill="url(#chromaGrad)" />
          <path d="M0,75 L40,73 L70,71 L95,72 L110,68 L130,55 L145,12 L160,55 L175,70 L200,68 L230,72 L260,71 L300,73" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded bg-foreground/90 flex items-center justify-center">
            <QrCode className="h-5 w-5 text-background" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-muted-foreground">Verification Code</div>
            <div className="text-xs font-mono font-bold">8Z8G-MRJB</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-accent font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Live · Verified
        </div>
      </div>
    </div>
  </div>
);

/* ----------------- PDF COA mockup ----------------- */
const PdfCoa = ({ expanded = false }: { expanded?: boolean }) => (
  <div className={`rounded-2xl bg-secondary/40 border border-border shadow-soft overflow-hidden transition-all ${!expanded && "group-hover:shadow-elegant group-hover:-translate-y-1"}`}>
    {/* PDF toolbar */}
    <div className="flex items-center justify-between px-4 py-2 bg-foreground text-background">
      <div className="flex items-center gap-2">
        <FileText className="h-3.5 w-3.5" />
        <span className="text-[10px] font-mono">COA_TB500_8Z8G-MRJB.pdf</span>
      </div>
      <span className="text-[10px] font-mono opacity-70">1 / 2</span>
    </div>

    {/* Paper */}
    <div className={`bg-white p-5 ${expanded ? "p-10" : ""}`}>
      {/* Letterhead */}
      <div className="flex items-center justify-between border-b-2 border-primary pb-3 mb-4">
        <div>
          <div className="font-display font-bold text-sm text-foreground">HelixAnalyticals</div>
          <div className="text-[9px] text-muted-foreground">Independent Peptide Testing Lab</div>
        </div>
        <div className="text-right text-[9px] text-muted-foreground font-mono">
          <div>ISO 17025 (Pending)</div>
          <div>helixanalyticals.com</div>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Certificate of Analysis</div>
        <div className="text-base font-bold text-foreground mt-1">TB500 (17-23 Fragment)</div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] mb-4">
        <Row label="Lot Number" value="TB10HYBCBC" />
        <Row label="Manufacturer" value="Harmony Peptide" />
        <Row label="Sample ID" value="TB10" />
        <Row label="Test Date" value="2025-04-12" />
        <Row label="Report ID" value="8Z8G-MRJB" />
        <Row label="Method" value="HPLC-UV / MS" />
      </div>

      {/* Results table */}
      <table className="w-full text-[10px] border-collapse mb-4">
        <thead>
          <tr className="bg-secondary/80 text-foreground">
            <th className="border border-border px-2 py-1 text-left">Test</th>
            <th className="border border-border px-2 py-1 text-right">Result</th>
            <th className="border border-border px-2 py-1 text-right">Spec</th>
            <th className="border border-border px-2 py-1 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-foreground/80">
          <tr><td className="border border-border px-2 py-1">Purity (HPLC)</td><td className="border border-border px-2 py-1 text-right font-mono">99.77%</td><td className="border border-border px-2 py-1 text-right font-mono">≥ 98%</td><td className="border border-border px-2 py-1 text-center text-accent font-bold">PASS</td></tr>
          <tr><td className="border border-border px-2 py-1">Identity (MS)</td><td className="border border-border px-2 py-1 text-right font-mono">TB500</td><td className="border border-border px-2 py-1 text-right font-mono">Match</td><td className="border border-border px-2 py-1 text-center text-accent font-bold">PASS</td></tr>
          <tr><td className="border border-border px-2 py-1">Net Quantity</td><td className="border border-border px-2 py-1 text-right font-mono">10.08 mg</td><td className="border border-border px-2 py-1 text-right font-mono">10.0 mg</td><td className="border border-border px-2 py-1 text-center text-accent font-bold">PASS</td></tr>
          <tr><td className="border border-border px-2 py-1">Endotoxin</td><td className="border border-border px-2 py-1 text-right font-mono">&lt; 0.5 EU/mg</td><td className="border border-border px-2 py-1 text-right font-mono">&lt; 5 EU/mg</td><td className="border border-border px-2 py-1 text-center text-accent font-bold">PASS</td></tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex items-end justify-between pt-3 border-t border-border">
        <div className="text-[9px] text-muted-foreground">
          <div className="font-semibold text-foreground">Authorized Signatory</div>
          <div className="italic mt-2 text-foreground/70">— Dr. E. Hayward, Lab Director</div>
        </div>
        <div className="h-10 w-10 rounded bg-foreground/90 flex items-center justify-center">
          <QrCode className="h-6 w-6 text-background" />
        </div>
      </div>
    </div>

    <div className="px-4 py-2 bg-secondary/60 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
      <span className="font-mono">8Z8G-MRJB</span>
      <span>Print · Archive</span>
    </div>
  </div>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-secondary/60 p-2">
    <div className="text-muted-foreground text-[10px]">{label}</div>
    <div className="font-bold text-foreground">{value}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b border-border/60 py-0.5">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-mono font-semibold text-foreground">{value}</span>
  </div>
);
