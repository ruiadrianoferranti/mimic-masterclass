import { forwardRef } from "react";
import QRCode from "react-qr-code";

interface CoaData {
  report_id: string;
  product_name: string;
  client_name: string;
  batch_lot: string;
  sample_received_date: string;
  analysis_completed_date: string;
  purity_result: string;
  identity_result: string;
  quantity_result: string;
  expected_quantity?: string;
  retention_time?: string;
  peak_area?: string;
  peak_height?: string;
  created_at: string;
  product_image_path?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateHPLCData(retentionTime: number, purity: number, peakHeight: number, reportId?: string) {
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
    
    const baselinePhase = seededRandom(seed + 1) * Math.PI * 2;
    y += Math.sin(x * 0.8 + baselinePhase) * 1.2;
    
    const solventShift = (seededRandom(seed + 10) - 0.5) * 0.3;
    y += peak(x, 0.65 + solventShift, 0.15, 8);
    y += peak(x, 1.1 + solventShift * 0.5, 0.08, 4);
    
    const impuritySeedBase = seed + 20;
    if (purityValue < 99.5) {
      const imp1Height = 12 + seededRandom(impuritySeedBase) * 8;
      const imp1Pos = 2.5 + seededRandom(impuritySeedBase + 1) * 1.5;
      y += peak(x, imp1Pos, 0.05 + seededRandom(impuritySeedBase + 2) * 0.03, imp1Height);
      
      const imp2Height = 8 + seededRandom(impuritySeedBase + 3) * 6;
      const imp2Pos = 3.5 + seededRandom(impuritySeedBase + 4) * 1.2;
      y += peak(x, imp2Pos, 0.05, imp2Height);
    }
    
    const mainTailing = 0.045 + seededRandom(seed + 100) * 0.015;
    y += peak(x, rt, mainTailing, peakHeight);
    
    if (purityValue < 99) {
      const secSeedBase = seed + 50;
      const sec1Height = 8 + seededRandom(secSeedBase) * 10;
      const sec1Pos = 5.8 + seededRandom(secSeedBase + 1) * 1.2;
      y += peak(x, sec1Pos, 0.06, sec1Height);
      
      const sec2Height = 4 + seededRandom(secSeedBase + 2) * 6;
      const sec2Pos = 7.0 + seededRandom(secSeedBase + 3) * 1.0;
      y += peak(x, sec2Pos, 0.05, sec2Height);
    }
    
    data.push({
      time: parseFloat(x.toFixed(2)),
      mAU: Math.max(0, parseFloat(y.toFixed(1)))
    });
  }
  return data;
}

function HPLCChart({ retentionTime, purity, peakHeight, reportId }: { retentionTime?: string; purity?: string; peakHeight?: string; reportId?: string }) {
  const rt = Number(retentionTime) || 5.0;
  const pur = Number(purity) || 100;
  const ph = Number(peakHeight) || 800;
  const data = generateHPLCData(rt, pur, ph, reportId);
  
  const width = 860;
  const height = 350;
  const padding = { top: 25, right: 20, bottom: 23, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const timeMin = data[0]?.time || 0;
  const timeMax = data[data.length - 1]?.time || 10;
  const mAUmax = Math.max(...data.map(d => d.mAU)) || 1000;
  
  const xScale = (t: number) => padding.left + ((t - timeMin) / (timeMax - timeMin)) * chartWidth;
  const yScale = (m: number) => padding.top + chartHeight - (m / mAUmax) * chartHeight;
  
  const areaPath = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(d.time)} ${yScale(d.mAU)}`
  ).join(' ') + ` L ${xScale(timeMax)} ${yScale(0)} L ${xScale(timeMin)} ${yScale(0)} Z`;
  
  const linePath = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(d.time)} ${yScale(d.mAU)}`
  ).join(' ');
  
  const rtX = xScale(rt);
  const rtY1 = padding.top;
  const rtY2 = height - padding.bottom;
  
  const primaryColor = "hsl(205 90% 48%)";
  const borderColor = "hsl(215 20% 90%)";
  const mutedColor = "hsl(215 15% 45%)";
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.1" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      
      <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="white" />
      
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
        <line 
          key={i}
          x1={padding.left} 
          y1={padding.top + chartHeight * pct} 
          x2={width - padding.right} 
          y2={padding.top + chartHeight * pct} 
          stroke={borderColor} 
          strokeDasharray="3 3"
        />
      ))}
      
      <path d={areaPath} fill="url(#chartFill)" />
      <path d={linePath} fill="none" stroke={primaryColor} strokeWidth={2} />
      
      <text x={padding.left - 5} y={padding.top - 8} fontSize="10" fill={mutedColor} textAnchor="end" fontFamily="system-ui, sans-serif">mAU</text>
      
      
      {[timeMin, (timeMin + timeMax) / 2, timeMax].map((t, i) => (
        <text key={i} x={xScale(t)} y={height - 5} fontSize="10" fill={mutedColor} textAnchor="middle" fontFamily="system-ui, sans-serif">
          {t.toFixed(1)}
        </text>
      ))}
      
      {[0, mAUmax / 2, mAUmax].map((m, i) => (
        <text key={i} x={padding.left - 5} y={yScale(m) + 3} fontSize="10" fill={mutedColor} textAnchor="end" fontFamily="system-ui, sans-serif">
          {Math.round(m)}
        </text>
      ))}
      
      <rect x={padding.left + 55} y={padding.top - 18} width="155" height="20" fill="rgba(255,255,255,0.95)" stroke={borderColor} rx="3" />
      <text x={padding.left + 62} y={padding.top - 4} fontSize="10" fill={primaryColor} fontFamily="monospace" fontWeight="600">
        RT: {rt.toFixed(2)} min | Area: {pur.toFixed(1)}%
      </text>
      
      <text x={width - padding.right - 5} y={height - 34} fontSize="10" fill={mutedColor} textAnchor="end" fontFamily="monospace, system-ui">minutes</text>
    </svg>
  );
}

interface Props {
  data: CoaData;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString + "T12:00:00Z");
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

function FieldRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-[oklch(0.93_0.01_250)] last:border-0">
      <span className="text-[var(--coa-blue)] w-5 text-sm">{icon}</span>
      <span className="text-xs font-semibold tracking-wider text-[var(--coa-blue)] flex-1">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function MetricCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-12 h-12 rounded-full bg-[var(--coa-surface)] flex items-center justify-center text-[var(--coa-blue)]">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-[var(--coa-blue)] leading-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function Signature() {
  return (
    <img 
      src="/signature.png" 
      alt="Signature" 
      style={{ 
        width: '200px', 
        height: 'auto', 
        opacity: 0.7,
        display: 'block'
      }} 
    />
  );
}

export const Certificate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const statusColor = (s: string) =>
    /conform|pass|measured/i.test(s) ? "text-[var(--coa-success)]" : "text-destructive";

  return (
    <div
      ref={ref}
      id="coa-certificate"
      className="bg-white text-foreground"
      style={{ width: "960px", padding: "28px", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <style>{`
        :root {
          --coa-blue: #1a3575;
          --coa-blue-dark: #152a6b;
          --coa-cyan: #00a8cc;
          --coa-surface: #e8eef5;
          --coa-success: #22c55e;
        }
      `}</style>

      {/* Header bar */}
      <div
        className="rounded-2xl px-8 py-6 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, var(--coa-blue) 0%, var(--coa-blue-dark) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#224191] to-[#1a3575] flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3c0 5 14 5 14 9s-14 4-14 9" />
              <path d="M19 3c0 5-14 5-14 9s14 4 14 9" />
              <path d="M7 5h10" />
              <path d="M8 9h8" />
              <path d="M8 15h8" />
              <path d="M7 19h10" />
            </svg>
          </div>
          <div className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">Helix</span>
            <span className="text-white">Analyticals</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-white tracking-wide">
          CERTIFICATE OF ANALYSIS
        </div>
      </div>

      {/* Sub header - Client Info */}
      <div
        className="mt-3 rounded-2xl px-6 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, var(--coa-blue) 0%, var(--coa-blue-dark) 100%)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-white flex flex-col items-center justify-center text-[var(--coa-blue)] text-xs font-semibold text-center p-2">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 mb-1" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
            </svg>
            <span>Logo</span>
          </div>
          <div className="text-white">
            <div className="text-lg font-semibold">{data.client_name || "Client Company"}</div>
            <div className="text-sm opacity-80">www.client-website.com</div>
          </div>
        </div>
        <div className="text-white text-sm grid grid-cols-[auto_auto] gap-x-6 gap-y-1">
          <div className="opacity-80">SAMPLE NAME:</div>
          <div className="text-right font-medium">{data.product_name || "N/A"}</div>
          <div className="opacity-80">SAMPLE CODE:</div>
          <div className="text-right font-medium">{data.report_id || "N/A"}</div>
          <div className="opacity-80">RECEIVED DATE:</div>
          <div className="text-right font-medium">{formatDate(data.sample_received_date)}</div>
          <div className="opacity-80">PUBLISHED DATE:</div>
          <div className="text-right font-medium">{formatDate(data.analysis_completed_date)}</div>
        </div>
      </div>

      {/* Info grid */}
      <div className="mt-6 rounded-2xl bg-[var(--coa-surface)] p-4 grid grid-cols-[200px_1fr_240px] gap-4 items-stretch">
        <div className="rounded-xl bg-white flex items-center justify-center overflow-hidden">
          {data.product_image_path ? (
            <img 
              src={data.product_image_path} 
              alt="Product Image" 
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="text-[var(--coa-blue)] text-center p-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2">
                <path d="M12 3 L3 8 L12 13 L21 8 L12 3 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M3 13 L12 18 L21 13" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M3 18 L12 23 L21 18" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-xs">Product Image</span>
            </div>
          )}
        </div>
        <div className="rounded-xl bg-white border border-[oklch(0.93_0.01_250)] px-5 py-2 flex flex-col justify-center">
          <FieldRow icon="◎" label="DECLARED IDENTITY" value={data.identity_result || data.product_name || "N/A"} />
          <FieldRow icon="▦" label="MATRIX TYPE:" value="PEPTIDE" />
          <FieldRow icon="A" label="SAMPLE NAME:" value={data.product_name || "N/A"} />
          <FieldRow icon="▭" label="SAMPLE SIZE:" value={data.quantity_result || "N/A"} />
          <FieldRow icon="№" label="LOT CODE:" value={data.batch_lot || "N/A"} />
        </div>
        <div className="rounded-xl bg-white px-5 py-4 space-y-2 flex flex-col justify-center">
          <MetricCard
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="10" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                <rect x="10" y="10" width="6" height="6" stroke="currentColor" strokeWidth="2" />
                <rect x="6.5" y="4" width="6" height="6" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
            value={data.quantity_result || "N/A"}
            label="Total Quantity"
          />
          <MetricCard
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3 C7 11 5 14 5 17 a7 7 0 0 0 14 0 c0-3-2-6-7-14z" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            }
            value={data.purity_result || "N/A"}
            label="Total Blend Purity"
          />
        </div>
      </div>

      {/* Results table */}
      <div className="mt-6 rounded-xl overflow-hidden border border-[oklch(0.93_0.01_250)]">
        <div
          className="grid grid-cols-5 text-white text-sm font-semibold"
          style={{ background: "var(--coa-blue)" }}
        >
          {["Sample", "Test", "Specification", "Result", "Status"].map((h) => (
            <div key={h} className="px-4 py-3 text-center">
              {h}
            </div>
          ))}
        </div>
        {[
          { sample: data.product_name, test: "IDENTITY", specification: data.product_name, result: "IDENTITY", status: "CONFORMS" },
          { sample: data.product_name, test: "QUANTITY", specification: "MEASURE", result: data.quantity_result, status: "MEASURED" },
          { sample: data.product_name, test: "PURITY", specification: "> 98.0%", result: data.purity_result, status: "CONFORMS" },
        ].map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-5 text-sm border-t border-[oklch(0.93_0.01_250)]"
            style={{ background: i % 2 ? "white" : "var(--coa-surface)" }}
          >
            <div className="px-4 py-3 text-center">{r.sample}</div>
            <div className="px-4 py-3 text-center">{r.test}</div>
            <div className="px-4 py-3 text-center">{r.specification}</div>
            <div className="px-4 py-3 text-center">{r.result}</div>
            <div className={`px-4 py-3 text-center font-semibold ${statusColor(r.status)}`}>
              {r.status}
            </div>
          </div>
        ))}
      </div>

      {/* Chromatogram */}
      <div className="mt-6 rounded-xl border border-[oklch(0.93_0.01_250)] overflow-hidden bg-white">
        <HPLCChart 
          retentionTime={data.retention_time} 
          purity={Number(data.purity_result)} 
          peakHeight={Number(data.peak_height) || 800}
          reportId={data.report_id}
        />
      </div>

      {/* Footer */}
      <div className="mt-8 grid grid-cols-2 gap-6 items-end px-8">
        <div className="pl-4">
          <div className="text-xs font-semibold text-[var(--coa-blue)] tracking-wider">
            RESULTS REVIEWED BY:
          </div>
          <div className="mt-1">
            <Signature />
          </div>
          <div className="text-sm font-medium">Dr. Peter Smith</div>
          <div className="text-xs text-muted-foreground">Lab Manager</div>
          <div className="text-xs text-muted-foreground">{formatDate(data.analysis_completed_date)}</div>
        </div>
        <div className="text-right pr-4 flex flex-col items-end">
          <div className="mb-2">
            <QRCode 
              value={`https://helixanalyticals.com/verify-report/${data.report_id}`}
              size={80}
              level="M"
              includeMargin={false}
            />
          </div>
          <div className="text-sm font-semibold text-[var(--coa-blue)]">www.helixanalyticals.com</div>
          <div className="text-xs text-muted-foreground">{data.report_id}</div>
          <div className="text-xs text-muted-foreground">{formatDate(data.analysis_completed_date)}</div>
        </div>
      </div>
    </div>
  );
});

Certificate.displayName = "Certificate";