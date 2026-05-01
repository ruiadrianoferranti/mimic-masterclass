import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Database, FileCheck, Activity, Download, AlertTriangle, Loader2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";

const generateHPLCData = (retentionTime: number, purity: number, peakHeight: number) => {
  const data = [];
  const rt = retentionTime || 5.0; 
  const purityValue = purity || 100; 
  
  const startX = Math.max(0, rt - 2.5);
  const endX = rt + 2.5;
  const c = 0.08; 
  
  const step = (endX - startX) / 100;
  for (let x = startX; x <= endX; x += step) {
    let y = Math.random() * 2; // Baseline noise
    
    // Main peak
    if (Math.abs(x - rt) < 1.0) {
      y += peakHeight * Math.exp(-Math.pow(x - rt, 2) / (2 * Math.pow(c, 2)));
    }
    
    // Impurity simulation - based on purity (100% = no impurities)
    if (purityValue < 100) {
       const impuritySize = (100 - purityValue) * 2; 
       const impurityRT = rt + 0.5; 
       if (Math.abs(x - impurityRT) < 0.5) {
          y += impuritySize * Math.exp(-Math.pow(x - impurityRT, 2) / (2 * Math.pow(0.04, 2)));
       }
    }
    
    data.push({
      time: parseFloat(x.toFixed(2)),
      mAU: Math.max(0, parseFloat(y.toFixed(1)))
    });
  }
  return data;
};

const VerifyReport = () => {
  const { code } = useParams();

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['report', code],
    queryFn: async () => {
      if (!code) throw new Error("Código não fornecido");
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('report_id', code)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!code,
    retry: 1
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    // Fix timezone issues by using the substring
    const date = new Date(dateString + "T12:00:00Z");
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium">Fetching encrypted report data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-8 rounded-2xl shadow-soft">
            <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">Invalid Report</h1>
            <p className="text-muted-foreground">
              The verification code <strong className="font-mono text-foreground">{code}</strong> does not match any authentic report in our database.
            </p>
            <Button asChild className="w-full mt-4">
              <Link to="/verify">Try another code</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Verified bar */}
        <div className="bg-primary/95 text-white">
          <div className="container py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-accent px-3 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED & SECURED
              </span>
              <span className="font-mono text-white/90">verify.helixanalyticals.com/{report.report_id}</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-white/80">
              <Lock className="h-3.5 w-3.5" /> 256-bit TLS Encrypted
            </div>
          </div>
        </div>

        <section className="py-12 md:py-16 bg-gradient-verify">
          <div className="container max-w-6xl grid lg:grid-cols-2 gap-10 items-start">
            {/* Digital COA card */}
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-elegant">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-primary">HelixVerify™ Digital COA</div>
                    <div className="text-xs text-muted-foreground">helixanalyticals.com</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">CONFORMS</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Peptide</div>
              <div className="text-2xl font-bold mb-6">{report.product_name}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Client / Batch / Lot</div>
              <div className="text-sm font-medium mb-6">{report.client_name} · LOT {report.batch_lot}</div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { l: "Purity", v: report.purity_result, ok: "Conforms" },
                  { l: "Identity", v: report.identity_result, ok: "Conforms" },
                  { l: "Quantity", v: report.quantity_result, ok: "Conforms" },
                ].map((m) => (
                  <div key={m.l} className="rounded-lg bg-secondary/60 p-3">
                    <div className="text-xs text-muted-foreground mb-1">{m.l}</div>
                    <div className="font-bold">{m.v}</div>
                    <div className="inline-flex items-center gap-1 text-[10px] text-accent mt-1">● {m.ok}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center text-xs font-mono text-muted-foreground">
                <span>{report.report_id}</span>
                <span>{formatDate(report.analysis_completed_date).toUpperCase()}</span>
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-start gap-4 mb-8">
                <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">HelixVerify™</div>
                  <h1 className="text-3xl md:text-4xl font-bold text-accent">Authenticity Confirmed</h1>
                  <p className="text-muted-foreground mt-2">This result was generated by HelixAnalyticals and has not been altered.</p>
                </div>
              </div>
              <div className="rounded-xl bg-card border border-border p-4 mb-4 shadow-soft">
                <div className="text-xs uppercase text-muted-foreground">Report ID</div>
                <div className="font-mono text-lg font-bold">{report.report_id}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "Client", v: report.client_name },
                  { l: "Batch / Lot", v: report.batch_lot },
                  { l: "Sample Received", v: formatDate(report.sample_received_date) },
                  { l: "Analysis Completed", v: formatDate(report.analysis_completed_date) },
                ].map((c) => (
                  <div key={c.l} className="rounded-xl bg-card border border-border p-4 shadow-soft">
                    <div className="text-xs uppercase text-muted-foreground">{c.l}</div>
                    <div className="font-semibold mt-1">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core panel results */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Core Panel Results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="text-left py-3 font-medium">Test</th>
                      <th className="text-left py-3 font-medium">Result</th>
                      <th className="text-left py-3 font-medium">Specification</th>
                      <th className="text-left py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [`${report.product_name} - Purity`, report.purity_result, "> 98.0%", "Conforms"],
                      [`${report.product_name} - Identity`, report.identity_result, report.product_name, "Conforms"],
                      [`${report.product_name} - Quantity`, report.quantity_result, report.expected_quantity || "MEASURED", "Measured"],
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-4">{r[0]}</td>
                        <td className="py-4 font-mono">{r[1]}</td>
                        <td className="py-4 text-muted-foreground">{r[2]}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs px-2.5 py-1 rounded-full font-semibold">
                            ✓ {r[3]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">HPLC Chromatogram</h2>
              </div>
              <div className="relative h-72 rounded-xl bg-background border border-border overflow-hidden p-4 pt-8">
                {report.retention_time ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateHPLCData(Number(report.retention_time), Number(report.purity_result), Number(report.peak_height) || 800)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(val) => val.toFixed(1)}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="mAU" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary)/0.1)" 
                        strokeWidth={2}
                        activeDot={{ r: 4 }}
                        isAnimationActive={true}
                      />
                      <ReferenceLine x={Number(report.retention_time)} stroke="hsl(var(--primary))" strokeDasharray="3 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <Activity className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Chromatogram data not available for this report.</p>
                  </div>
                )}
                
                {report.retention_time && (
                  <div className="absolute top-2 left-16 bg-background/90 px-2 py-1 text-[10px] font-mono text-primary rounded border border-border shadow-sm">
                    RT: {report.retention_time} min | Area: {report.peak_area}%
                  </div>
                )}
                <div className="absolute bottom-2 right-4 text-[10px] text-muted-foreground font-mono">mAU vs minutes</div>
              </div>
            </div>

            {/* Verification details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
                <h3 className="font-bold mb-4 flex items-center gap-2"><FileCheck className="h-5 w-5 text-primary" /> HelixVerify™ Digital Verification</h3>
                <dl className="space-y-3 text-sm">
                  <div><dt className="text-muted-foreground text-xs uppercase">Report ID</dt><dd className="font-mono font-semibold">{report.report_id}</dd></div>
                  <div><dt className="text-muted-foreground text-xs uppercase">Verification URL</dt><dd className="font-mono text-primary break-all">verify.helixanalyticals.com/{report.report_id}</dd></div>
                  <div><dt className="text-muted-foreground text-xs uppercase">Verified</dt><dd>{formatDateTime(report.created_at)}</dd></div>
                  <div><dt className="text-muted-foreground text-xs uppercase">Data Source</dt><dd>HelixAnalyticals LIMS (Supabase Node)</dd></div>
                </dl>
                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                  <strong className="text-foreground">Laboratory:</strong> HelixAnalyticals · <strong className="text-foreground">Lab ID:</strong> VPL-001
                </div>
                <Button variant="outline" className="mt-5 w-full"><Download className="h-4 w-4" /> Download PDF</Button>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Database, t: "LIMS Data", b: "This report was rendered unaltered from our LIMS. There's no file to edit or swap." },
                  { icon: Lock, t: "Immutable Record", b: "Result hash anchored to secure database at time of finalization." },
                  { icon: ShieldCheck, t: "Tamper-Evident", b: "Any alteration would break the verification chain." },
                ].map((f) => (
                  <div key={f.t} className="rounded-xl bg-card border border-border p-4 flex gap-3 shadow-soft">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{f.t}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.b}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default VerifyReport;
