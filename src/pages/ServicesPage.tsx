import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, DollarSign, Clock, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { SignUpModal } from "@/components/SignUpModal";

const peptides = ["AICAR","AOD-9604","BPC-157","Cagrilintide","CJC-1295 (no DAC)","Delta Sleep-Inducing Peptide","Epitalon","Epithalon","GHK-Cu","GHRP-6","Hexarelin","IGF-1 LR3","Ipamorelin","Kisspeptin-10","KPV","Liraglutide","LL-37","Melanotan I","Melanotan II","MOTS-c","MTP 131","NAD+","Pinealon","PT-141","Retatrutide","Selank","Semaglutide","Semax","Sermorelin","SLU-PP-332","TB500 (17-23 Fragment)","TB500 (Thymosin Beta 4)","Tesamorelin","Testagen","Thymosin Alpha-1","Thymosin Beta-4","Thymulin","Tirzepatide","Triptorelin","VIP"];

const upcoming = ["Heavy Metals — May 2026","Residual Solvents — April 2026","Residual Moisture — April 2026","Nuclear Magnetic Resonance (NMR) — Q3 2026","Variance Testing — April 2026","Sterility (Plate) — April 2026","LC-MS Identity — April 2026"];

const ServicesPage = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-16">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-verify border-b border-border">
        <div className="container max-w-4xl text-center">
          <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">Testing Services</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">One Price. Any Peptide.</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            No variable pricing. No hidden fees. No "contact us for a quote." Just straightforward testing at a flat rate — regardless of which peptide you're testing.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: DollarSign, title: "Fixed Pricing", body: "Same price for Semaglutide as BPC-157. No complexity surcharges." },
              { icon: Clock, title: "48-72 Hour Turnaround", body: "Standard results typically in 2 business days from sample receipt." },
              { icon: ShieldCheck, title: "Verified Results", body: "Digital COA + traditional PDF. Cryptographically anchored verification." },
            ].map((s) => (
              <div key={s.title} className="rounded-xl bg-card border border-border p-5 text-left shadow-soft">
                <s.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <div className="text-xs font-mono tracking-widest text-primary uppercase mb-3">Pricing</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Choose your base test package, add biosafety panels as needed. No surprises.</p>
          </div>

          <div className="rounded-2xl bg-secondary/40 border border-border p-8 mb-12 max-w-3xl mx-auto">
            <h3 className="font-bold text-xl mb-2">Why Fixed Pricing?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Why do most labs charge $400 to test one peptide but $150 for another? It's not the equipment. It's not the run time. <strong className="text-foreground">It's demand-based pricing — and you're the one paying the markup.</strong> We do it differently. Every peptide in our catalog costs the same to test. Whether it's a high-demand GLP-1 or a research-grade BPC-157, you pay one flat rate. No popularity tax. No guessing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Core */}
            <div className="rounded-2xl bg-card border border-border p-7 shadow-soft">
              <h3 className="text-xl font-bold mb-1">Core Panel</h3>
              <p className="text-sm text-muted-foreground mb-5">Identity, Purity & Quantity</p>
              <div className="mb-6">
                <span className="font-display text-5xl font-bold">$250</span>
                <span className="text-muted-foreground"> / sample</span>
              </div>
              <ul className="space-y-2 text-sm mb-6">
                {["HPLC Identity Confirmation","Purity Analysis (%)","Quantity Verification (mg)","Digital + PDF Certificate","Cryptographically Immutable"].map((f) => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/request-service">Order Now</Link>
              </Button>
            </div>
            {/* Biosafety addons */}
            <div className="rounded-2xl bg-card border border-border p-7 shadow-soft">
              <h3 className="text-xl font-bold mb-1">Biosafety Add-Ons</h3>
              <p className="text-sm text-muted-foreground mb-5">Enhance any panel with safety testing</p>
              <div className="space-y-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold">Endotoxin (LAL)</h4>
                    <span className="font-bold text-primary">$200</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Bacterial endotoxin quantification</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold">Sterility (PCR)</h4>
                    <span className="font-bold text-primary">$230</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Rapid microbial detection</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-5 text-center">Add to Core Panel at checkout</p>
            </div>
            {/* HelixShield */}
            <div className="rounded-2xl bg-gradient-primary text-white p-7 shadow-elegant relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">Best Value</div>
              <h3 className="text-xl font-bold mb-1">HelixShield Panel</h3>
              <p className="text-sm text-white/80 mb-5">Core + Full Biosafety Suite</p>
              <div className="mb-6">
                <span className="text-white/60 line-through mr-2">$680</span>
                <span className="font-display text-5xl font-bold">$578</span>
                <div className="text-xs text-white/80 mt-1">per sample · Save 15%</div>
              </div>
              <ul className="space-y-2 text-sm mb-6">
                {["Everything in Core Panel","Endotoxin (LAL) Testing","Sterility (PCR) Testing","Full Biosafety Certification","Satisfaction Guaranteed"].map((f) => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 mt-0.5" /> {f}</li>
                ))}
              </ul>
              <Button variant="glass" className="w-full bg-white/20 border-white/40 hover:bg-white/30" asChild>
                  <Link to="/request-service">Order Now</Link>
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Customer Offer */}
      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="container max-w-3xl text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-warning mb-3">New Customer Offer</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Try Us Risk-Free: 50% Off Your First Sample</h2>
          <p className="text-muted-foreground mb-6">
            Switching labs is a big decision. We get it. That's why we're making it easy to experience our 48-72 hour turnaround and verification system firsthand — at half the cost. One sample. No commitment. See why vendors are making the switch.
          </p>
          <Button size="lg" variant="hero" asChild>
                <Link to="/request-service">Claim 50% Off</Link>
              </Button>
          <p className="text-xs text-muted-foreground mt-3">First order only · Auto-applies at checkout</p>
        </div>
      </section>

      {/* Peptides catalog */}
      <section className="py-24">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <div className="text-xs font-mono tracking-widest text-primary uppercase mb-3">Supported Peptides & Compounds</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">78 Peptides. One Price.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">We maintain validated methods for every peptide & compound below. All tested at our flat $250 rate.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {peptides.map((p) => (
              <div key={p} className="rounded-lg border border-border bg-card px-4 py-3 text-sm hover:border-primary/40 transition-colors shadow-soft">
                {p}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing <strong>{peptides.length}</strong> peptides · Full catalog includes 78
          </div>

          {/* Other Products — Custom Quote */}
          <div className="mt-12 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-10 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  Beyond Peptides
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  Testing Other Products? Request a Custom Quote.
                </h3>
                <p className="text-muted-foreground max-w-2xl">
                  We don't only test peptides. If your sample isn't in the catalog above — small molecules, biologics, raw materials, or specialty compounds — our team will tailor an analytical method and quote to your needs.
                </p>
              </div>
              <div className="shrink-0">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">Request Custom Quote <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-2 text-center">Expanding Our Capabilities</h3>
            <p className="text-center text-muted-foreground mb-8">Additional testing services currently in development</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
              {upcoming.map((u) => (
                <div key={u} className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-sm">
                  {u}
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-sm text-muted-foreground">
              Want to be notified when these services launch? <Link to="/contact" className="text-primary underline">Contact us</Link> to join our waitlist.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary/30 border-y border-border">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8">Create your free account and place your first order in minutes. No minimums, no contracts.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <SignUpModal trigger={<Button variant="hero" size="lg">Create Free Account</Button>} />
            <Button variant="outline" size="lg" asChild><Link to="/contact">Talk to Our Team</Link></Button>
          </div>
        </div>
      </section>

      <ContactForm />
    </main>
    <Footer />
  </div>
);

export default ServicesPage;
