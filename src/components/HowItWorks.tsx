const steps = [
  { n: "01", tag: "Takes 2 minutes", title: "Create Your Account", body: "Sign up for free — no credit card required. Get instant access to your client portal where you'll manage orders, track samples, and access results." },
  { n: "02", tag: "Self-serve ordering", title: "Submit Your Order", body: "Select your testing panel, enter sample details, and check out. Transparent pricing — no hidden fees." },
  { n: "03", tag: "Day 1", title: "Your Samples Arrive", body: "Ship your samples to our US facility. No customs forms, no international shipping delays, no seizure risk." },
  { n: "04", tag: "Day 2", title: "Track in Real-Time", body: "Watch your sample move through our pipeline — no black hole. See every status: Received → Analyzing → In Review → Complete." },
  { n: "05", tag: "Day 2-3", title: "Analysis & QC Review", body: "Our team runs your selected samples and verifies results with redundant quality control checks." },
  { n: "06", tag: "Day 3", title: "Results Go Live", body: "Your results publish to a unique, permanent URL — rendered live from our LIMS. Data is hashed and cryptographically signed." },
];

export const HowItWorks = () => (
  <section className="py-24 md:py-32 bg-card/30 border-y border-border/50">
    <div className="container">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">How It Works</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">From sign-up to verified results in 48-72 hours.</h2>
        <p className="text-muted-foreground text-lg">Fully self-serve. No quotes, no back-and-forth, no waiting on sales calls.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl bg-gradient-card border border-border p-6 hover:border-primary/40 transition-colors">
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-display text-5xl font-bold text-gradient">{s.n}</span>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{s.tag}</span>
            </div>
            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
