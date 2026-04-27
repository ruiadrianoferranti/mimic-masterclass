import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldAlert, FileWarning, FlaskConical, Skull, FileX, QrCode, KeyRound, BadgeCheck, Database, Lock, Stamp } from "lucide-react";

const problems = [
  { icon: FileWarning, title: "PDF Editing", body: "A fast and loose vendor harvests a clean COA from another vendor and edits the PDF to make it their own. Even watermarks can be removed or replaced with AI. The PDF metadata often still shows the original creation date from years ago. This is outright fraud, but it is not uncommon — especially with low-price vendors.", example: "We've seen the same COA used across 15+ suppliers with different batch numbers. The file properties showed it was created in 2019.", exampleLabel: "Real example:" },
  { icon: FlaskConical, title: "No Source Connection", body: "Once a PDF is exported, it's completely disconnected from the laboratory system that created it. There's no live link back to the original data — just a static snapshot that exists independently.", example: "Suspiciously flat baselines, peaks that don't match expected retention times, or chromatograms where the noise pattern suddenly changes mid-run.", exampleLabel: "What to look for:" },
  { icon: ShieldAlert, title: 'The "Golden Sample" Bait', body: "A research peptide vendor obtains product from a Chinese supplier and has it tested by a third-party lab, with good results. Trusting that supplier, they continue to display the same COA for subsequent shipments. But most overseas suppliers are trading companies that obtain API from multiple manufacturers. The next shipment may be completely different — or damaged by heat exposure during shipping.", example: "Even a COA that has a verification link to the testing lab does not fix this problem.", exampleLabel: "The Verification Problem:" },
  { icon: Skull, title: "Dry Labs & Fabrication", body: 'Some "labs" don\'t run tests at all. They generate plausible-looking results based on what you told them you\'re sending. No instrument. No analysis. Just a PDF.', example: "Unusually fast turnaround, suspiciously perfect results, no raw data available, and prices that seem too good to be true.", exampleLabel: "Red flags:" },
];

const fails = [
  { icon: FileX, title: "Static PDFs", body: '"Just a PDF or a JPEG of a result is not proof." These files can be edited, duplicated, and redistributed without any trace. There\'s no connection between the document and the actual analysis — it\'s just pixels on a screen.' },
  { icon: QrCode, title: "Legacy QR Codes", body: '"If the QR links to a file, the file can be swapped." Most QR-based systems just link to a hosted PDF. Replace the file on the server, and every QR code now points to a different document. The QR is just a URL — not verification.' },
  { icon: KeyRound, title: "Key/Code Systems", body: '"Nobody actually types in a 16-character code." Verification keys add friction. Customers don\'t use them. And if the underlying system still stores editable data, the key is just security theater.' },
  { icon: BadgeCheck, title: '"Trust Us" Claims', body: "Accreditations and certifications matter — but they certify the lab, not the result. An ISO 17025 lab can still produce a PDF that gets edited downstream. The credential doesn't follow the document." },
];

const layers = [
  { n: 1, icon: Database, title: "Live-Rendered Results", body: "Your results don't exist as a file. They're rendered live from our Laboratory Information Management System (LIMS) every time someone views them. There's no PDF to edit, no file to swap, no document to forge.", how: "Each report has a unique URL (e.g., verify.helixanalyticals.com/VPL-2024-08291). When you visit that URL, our system queries the database and renders the current, authoritative data. The 'document' is the database — not a copy of it.", howLabel: "How it works" },
  { n: 2, icon: Lock, title: "Cryptographic Signing", body: "When we finalize a result, we cryptographically hash the data and sign it. This creates a permanent, immutable timestamp that proves the data existed in its current form at a specific moment.", how: "Even if someone compromised our database, they couldn't alter historical results without the hash mismatch being immediately detectable. The signature proves the data hasn't changed.", howLabel: "What this means" },
  { n: 3, icon: Stamp, title: "Physical Serialization", body: "For premium testing tiers, we provide tamper-evident seals with unique serial numbers that link the physical vial to its digital record. Scan the QR, see the results — and know that seal hasn't been transferred.", how: "Your customers can verify in seconds. Scan the code, see the live data, check the cryptographic signature. No PDFs. No 'trust us.' Just proof.", howLabel: "The result" },
];

const TrustProblemPage = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-16">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-verify border-b border-border">
        <div className="container max-w-4xl text-center">
          <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">The Trust Problem</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">The Peptide Industry Has a Verification Gap</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            PDF certificates are easy to edit, duplicate, and redistribute — and there's no way for your customers to tell the difference. Here's what we're doing about it.
          </p>
          <p className="text-base text-foreground/80 italic">
            Your reputation is only as good as the proof behind it. And right now, that proof is a PDF anyone with Acrobat can edit.
          </p>
        </div>
      </section>

      {/* Four ways */}
      <section className="py-24">
        <div className="container max-w-6xl">
          <div className="text-center mb-14">
            <div className="text-xs font-mono tracking-widest text-primary uppercase mb-3">The Problem with PDFs</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Four Ways Traditional COAs Fall Short</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">These aren't hypotheticals. They're happening every day across the industry — and your customers can't tell the difference.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="rounded-2xl bg-card border border-border p-7 shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <p.icon className="h-5 w-5 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.body}</p>
                <div className="rounded-lg bg-secondary/50 p-4 text-sm">
                  <div className="font-semibold mb-1">{p.exampleLabel}</div>
                  <p className="text-muted-foreground italic">"{p.example}"</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 max-w-3xl mx-auto text-center">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">This isn't about bad actors</div>
            <p className="text-muted-foreground">Many vendors don't even know their COAs can be tampered with. They trust their supplier, who trusts their manufacturer, who trusts their "lab." The chain of trust is only as strong as its weakest link — and that link is usually a static PDF.</p>
          </div>
        </div>
      </section>

      {/* Why solutions fail */}
      <section className="py-24 bg-secondary/30 border-y border-border">
        <div className="container max-w-6xl">
          <div className="text-center mb-14">
            <div className="text-xs font-mono tracking-widest text-primary uppercase mb-3">Why Current Solutions Fail</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Band-Aids on a Broken System</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The industry has tried to solve this before. Here's why those solutions don't work.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {fails.map((f) => (
              <div key={f.title} className="rounded-2xl bg-card border border-border p-6 flex gap-4 shadow-soft">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three-layer stack */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <div className="text-xs font-mono tracking-widest text-primary uppercase mb-3">The HelixAnalyticals Approach</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">A Three-Layer Security Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We didn't just build a better PDF. We built a system where fraud is mathematically impossible — not just difficult.</p>
          </div>
          <div className="space-y-6">
            {layers.map((l) => (
              <div key={l.n} className="rounded-2xl bg-card border border-border p-8 shadow-soft grid md:grid-cols-[80px_1fr] gap-6">
                <div>
                  <div className="h-14 w-14 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-display text-2xl font-bold shadow-glow">
                    {l.n}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <l.icon className="h-5 w-5 text-primary" />
                    <h3 className="text-2xl font-bold">{l.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{l.body}</p>
                  <div className="rounded-lg bg-secondary/50 border border-border p-4">
                    <div className="text-xs font-mono uppercase tracking-wider text-primary mb-1">{l.howLabel}</div>
                    <p className="text-sm text-foreground/80">{l.how}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Side by side */}
      <section className="py-24 bg-secondary/30 border-y border-border">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs font-mono tracking-widest text-primary uppercase mb-3">Side by Side</div>
            <h2 className="text-3xl md:text-5xl font-bold">Traditional COA vs. HelixVerified COA</h2>
          </div>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
            <div className="rounded-2xl border border-destructive/30 bg-card p-7 shadow-soft">
              <div className="text-xs font-mono uppercase tracking-widest text-destructive mb-2">Traditional COA</div>
              <h3 className="text-xl font-bold mb-5">Static PDF Document</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Generic Labs Inc.", "PDF v1.7"],
                  ["PDF Recycling", "Vulnerable"],
                  ["Chromatogram Manipulation", "Vulnerable"],
                  ['The "Golden Sample" Bait', "Vulnerable"],
                  ["Dry Labs & Fabrication", "Vulnerable"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-destructive">{v}</span>
                  </div>
                ))}
                <div className="text-xs text-muted-foreground pt-2 italic">File created: 2019-03-22 (metadata)</div>
              </div>
            </div>
            <div className="flex items-center justify-center font-display text-2xl text-muted-foreground">vs</div>
            <div className="rounded-2xl border border-accent/30 bg-card p-7 shadow-elegant">
              <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">HelixAnalyticals Verification</div>
              <h3 className="text-xl font-bold mb-5">Live-Rendered Result</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["HelixAnalyticals", "✓ Verified"],
                  ["Report ID", "VPL-2024-08291"],
                  ["Compound", "BPC-157"],
                  ["Purity", "98.7%"],
                  ["Finalized", "2024-08-29 14:32 UTC"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
                <div className="text-xs pt-2"><span className="font-bold">Cryptographic signature:</span> <span className="text-accent">Secured</span></div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="hero" size="lg"><Link to="/verify">Go to Verification Portal</Link></Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready for Testing You Can Actually Trust?</h2>
          <p className="text-muted-foreground text-lg mb-8">Join the vendors and suppliers who've moved beyond PDFs. Get results your customers can verify themselves — in seconds.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg">Create Free Account</Button>
            <Button variant="outline" size="lg" asChild><Link to="/services">View Testing Services</Link></Button>
          </div>
        </div>
      </section>

      <ContactForm />
    </main>
    <Footer />
  </div>
);

export default TrustProblemPage;
