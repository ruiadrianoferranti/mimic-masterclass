import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Beaker,
  FileCheck2,
  Clock,
  CheckCircle2,
  Package,
  Plus,
  Mail,
  Building2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const tests = [
  {
    id: "8Z8G-MRJB",
    product: "Semaglutide 5mg",
    submittedAt: "Apr 22, 2026",
    status: "Verified",
    coa: true,
  },
  {
    id: "K3LP-7QXA",
    product: "BPC-157 5mg",
    submittedAt: "Apr 24, 2026",
    status: "In Analysis",
    coa: false,
  },
  {
    id: "P9MN-2WTC",
    product: "Tirzepatide 10mg",
    submittedAt: "Apr 26, 2026",
    status: "Received",
    coa: false,
  },
];

const statusStyles: Record<string, string> = {
  Verified: "bg-accent/15 text-accent border-accent/40",
  "In Analysis": "bg-warning/15 text-warning border-warning/40",
  Received: "bg-primary/15 text-primary border-primary/40",
};

const Dashboard = () => {
  // Demo user (replace with auth user when backend is connected)
  const user = {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.com",
    company: "Northwind Biotech",
    plan: "HelixVerified — Pro",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container">
          {/* Welcome */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                HelixAnalyticals Dashboard
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
                Welcome back, {user.firstName}.
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Manage your samples, download verified COAs, and request new analyses.
              </p>
            </div>
            <Button variant="hero" size="lg" asChild>
              <Link to="/services"><Plus className="h-4 w-4" /> New Test Request</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={Beaker} label="Total Tests" value="12" />
            <StatCard icon={CheckCircle2} label="Verified" value="9" tone="accent" />
            <StatCard icon={Clock} label="In Progress" value="2" tone="warning" />
            <StatCard icon={FileCheck2} label="COAs Available" value="9" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tests */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Your Tests
                </CardTitle>
                <CardDescription>Most recent samples submitted to the lab.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tests.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display font-semibold">{t.product}</span>
                        <Badge variant="outline" className={statusStyles[t.status]}>{t.status}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        ID {t.id} · Submitted {t.submittedAt}
                      </div>
                    </div>
                    {t.coa ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/verify-report/${t.id}`}>View COA <ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled>Pending</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Account */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Your profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Row label="Name" value={`${user.firstName} ${user.lastName}`} />
                  <Row label="Email" value={user.email} icon={Mail} />
                  <Row label="Company" value={user.company} icon={Building2} />
                  <Row label="Plan" value={user.plan} icon={ShieldCheck} />
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: { icon: any; label: string; value: string; tone?: "primary" | "accent" | "warning" }) => {
  const toneClass =
    tone === "accent"
      ? "border-accent/30 bg-accent/10 text-accent"
      : tone === "warning"
      ? "border-warning/30 bg-warning/10 text-warning"
      : "border-primary/30 bg-primary/10 text-primary";
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`h-11 w-11 rounded-full border flex items-center justify-center ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-display font-bold leading-none">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const Row = ({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span className="flex items-center gap-1.5 font-medium text-right">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      {value}
    </span>
  </div>
);

export default Dashboard;
