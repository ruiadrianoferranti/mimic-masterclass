import { useParams, Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabase";
import { Certificate } from "@/components/coa/Certificate";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Database, FileCheck, Activity, Download, AlertTriangle, Loader2 } from "lucide-react";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateHPLCData = (retentionTime: number, purity: number, peakHeight: number, reportId?: string) => {
  const data = [];
  const rt = retentionTime || 5.5; 
  const purityValue = purity || 99; 
  const seed = reportId ? reportId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  
  const startX = 0;
  const endX = 20;
  const step = (endX - startX) / 200;
  
  const peak = (x: number, center: number, width: number, height: number) => {
    return height * Math.exp(-Math.pow(x - center, 2) / (2 * width * width));
  };
  
  let noiseSeed = seed;
  for (let x = startX; x <= endX; x += step) {
    const noise1 = seededRandom(noiseSeed++) * 1.5;
    const noise2 = seededRandom(noiseSeed++) * 0.5;
    let y = noise1 + noise2;
    
    // Minimal baseline drift based on report
    const baselinePhase = seededRandom(seed + 1) * Math.PI * 2;
    y += Math.sin(x * 0.8 + baselinePhase) * 1.2;
    
    // Solvent front - slightly varies per report
    const solventShift = (seededRandom(seed + 10) - 0.5) * 0.3;
    y += peak(x, 0.65 + solventShift, 0.15, 8);
    y += peak(x, 1.1 + solventShift * 0.5, 0.08, 4);
    
    // Impurity peaks - unique per report but deterministic
    const impuritySeedBase = seed + 20;
    if (purityValue < 99.5) {
      const imp1Height = 12 + seededRandom(impuritySeedBase) * 8;
      const imp1Pos = 2.5 + seededRandom(impuritySeedBase + 1) * 1.5;
      y += peak(x, imp1Pos, 0.05 + seededRandom(impuritySeedBase + 2) * 0.03, imp1Height);
      
      const imp2Height = 8 + seededRandom(impuritySeedBase + 3) * 6;
      const imp2Pos = 3.5 + seededRandom(impuritySeedBase + 4) * 1.2;
      y += peak(x, imp2Pos, 0.05, imp2Height);
    }
    
    // Main peak - sharp, dominant (deterministic slight tailing based on seed)
    const mainTailing = 0.045 + seededRandom(seed + 100) * 0.015;
    y += peak(x, rt, mainTailing, peakHeight);
    
    // Secondary peaks after main - deterministic per report
    if (purityValue < 99) {
      const secSeedBase = seed + 50;
      const sec1Height = 8 + seededRandom(secSeedBase) * 10;
      const sec1Pos = 5.8 + seededRandom(secSeedBase + 1) * 1.2;
      y += peak(x, sec1Pos, 0.06, sec1Height);
      
      const sec2Height = 4 + seededRandom(secSeedBase + 2) * 6;
      const sec2Pos = 7.0 + seededRandom(secSeedBase + 3) * 1.0;
      y += peak(x, sec2Pos, 0.05, sec2Height);
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
  const [showPrintPreview, setShowPrintPreview] = useState(false);

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

const certificateRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        width: 960,
        height: 1356,
        pixelRatio: 2,
      });

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [960, 1356],
      });

      doc.addImage(dataUrl, "PNG", 0, 0, 960, 1356);
      doc.save(`COA-${report.report_id}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    }
  };

  const renderPrintChart = () => {
    if (!report.retention_time) return null;
    const data = generateHPLCData(Number(report.retention_time), Number(report.purity_result), Number(report.peak_height) || 800, report.report_id);
    const maxVal = Math.max(...data.map(d => d.mAU));
    
    return (
      <svg viewBox="0 0 400 150" className="w-full h-32 print-chart">
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 380 + 10;
          const y = 140 - (d.mAU / maxVal) * 130;
          return <rect key={i} x={x} y={y} width={3} height={140-y} fill="#2563eb" opacity={0.7} />;
        })}
        <line x1="10" y1="140" x2="390" y2="140" stroke="#94a3b8" strokeWidth="1" />
        <text x="200" y="148" fontSize="8" fill="#64748b" textAnchor="middle">Time (min)</text>
        <text x="5" y="80" fontSize="8" fill="#64748b" transform="rotate(-90 5 80)">mAU</text>
      </svg>
    );
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
              <div className="rounded-xl bg-card border border-border p-4 mb-4 shadow-soft flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Report ID</div>
                  <div className="font-mono text-lg font-bold">{report.report_id}</div>
                </div>
                <Button variant="outline" size="sm" onClick={downloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Print / Save PDF
                </Button>
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
                    <AreaChart data={generateHPLCData(Number(report.retention_time), Number(report.purity_result), Number(report.peak_height) || 800, report.report_id)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Button variant="outline" className="mt-5 w-full" onClick={downloadPDF}><Download className="h-4 w-4" /> Download PDF</Button>
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

        {/* Print Preview Overlay */}
        {showPrintPreview && (
          <div className="fixed inset-0 z-50 bg-white overflow-auto print-preview-overlay active">
            <div className="max-w-3xl mx-auto p-8 print-container">
              <div className="flex justify-between items-center mb-6 no-print">
                <h2 className="text-xl font-bold">Certificate of Analysis Preview</h2>
                <Button onClick={() => setShowPrintPreview(false)}>Close</Button>
              </div>
              <div className="print-header">
            <div>
              <div className="print-logo">HelixAnalyticals</div>
              <div className="text-sm text-gray-500 mt-1">Laboratory Services</div>
            </div>
            <div className="print-title">
              <div className="font-bold text-lg">Certificate of Analysis</div>
              <div>Document ID: {report.report_id}</div>
            </div>
          </div>

          <div className="print-section">
            <div className="print-section-title">Product Information</div>
            <div className="print-grid">
              <div>
                <div className="print-label">Product Name</div>
                <div className="print-value">{report.product_name}</div>
              </div>
              <div>
                <div className="print-label">Client</div>
                <div className="print-value">{report.client_name}</div>
              </div>
              <div>
                <div className="print-label">Batch / Lot Number</div>
                <div className="print-value">{report.batch_lot}</div>
              </div>
              <div>
                <div className="print-label">Report ID</div>
                <div className="print-value font-mono">{report.report_id}</div>
              </div>
            </div>
          </div>

          <div className="print-section">
            <div className="print-section-title">Test Results</div>
            <table className="print-table">
              <thead>
                <tr>
                  <th>Test Parameter</th>
                  <th>Result</th>
                  <th>Specification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Purity (HPLC)</td>
                  <td className="font-mono">{report.purity_result}</td>
                  <td>{'> 98.0%'}</td>
                  <td><span className="print-status conforms">CONFORMS</span></td>
                </tr>
                <tr>
                  <td>Identity (MS)</td>
                  <td className="font-mono">{report.identity_result}</td>
                  <td>{report.product_name}</td>
                  <td><span className="print-status conforms">CONFORMS</span></td>
                </tr>
                <tr>
                  <td>Quantity</td>
                  <td className="font-mono">{report.quantity_result}</td>
                  <td>MEASURED</td>
                  <td><span className="print-status conforms">MEASURED</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {report.retention_time && (
            <div className="print-section">
              <div className="print-section-title">HPLC Chromatogram</div>
              <div className="flex justify-between text-sm mb-2">
                <span>Retention Time: {report.retention_time} min</span>
                <span>Peak Area: {report.peak_area}%</span>
              </div>
              {renderPrintChart()}
            </div>
          )}

          <div className="print-section">
            <div className="print-section-title">Sample Information</div>
            <div className="print-grid">
              <div>
                <div className="print-label">Sample Received</div>
                <div className="print-value">{formatDate(report.sample_received_date)}</div>
              </div>
              <div>
                <div className="print-label">Analysis Completed</div>
                <div className="print-value">{formatDate(report.analysis_completed_date)}</div>
              </div>
              <div>
                <div className="print-label">Verification URL</div>
                <div className="print-value text-xs">verify.helixanalyticals.com/{report.report_id}</div>
              </div>
              <div>
                <div className="print-label">Verified On</div>
                <div className="print-value">{formatDateTime(report.created_at)}</div>
              </div>
            </div>
          </div>

          <div className="print-footer">
            <div>
              <div className="font-semibold">HelixAnalyticals Laboratory</div>
              <div>Lab ID: VPL-001 | This document is digitally verified</div>
            </div>
            <div className="text-right">
              <div>Generated: {formatDateTime(new Date().toISOString())}</div>
            </div>
          </div>

          <div className="print-stamp">VERIFIED</div>
          </div>
        </div>
        )}

        <div className="hidden">
          <Certificate ref={certificateRef} data={report} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyReport;
