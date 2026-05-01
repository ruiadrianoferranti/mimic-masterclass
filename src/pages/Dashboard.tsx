import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
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

const statusStyles: Record<string, string> = {
  Verified:     "bg-accent/15 text-accent border-accent/40",
  "In Analysis":"bg-warning/15 text-warning border-warning/40",
  Received:     "bg-primary/15 text-primary border-primary/40",
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Read persisted user from localStorage
  const stored = localStorage.getItem("helix_user");
  const savedUser = stored ? JSON.parse(stored) : null;

  // Redirect to home if not logged in
  useEffect(() => {
    if (!savedUser) navigate("/");
  }, []);

  const user = {
    firstName: savedUser?.firstName ?? "Guest",
    lastName:  savedUser?.lastName  ?? "",
    email:     savedUser?.email     ?? "",
    company:   savedUser?.company   ?? "—",
    plan:      "HelixVerified — Pro",
  };

  // Fetch reports for logged-in user
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["user-reports", user.email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user.email,
  });

  const getStatus = (r: any) => {
    if (r.purity_result && r.retention_time) return "Verified";
    if (r.purity_result) return "In Analysis";
    return "Received";
  };

  const totalTests   = reports.length;
  const verified     = reports.filter((r: any) => getStatus(r) === "Verified").length;
  const inProgress   = reports.filter((r: any) => getStatus(r) === "In Analysis").length;
  const coasAvail    = reports.filter((r: any) => r.retention_time).length;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
      .format(new Date(dateString + "T12:00:00Z"));
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
            <StatCard icon={Beaker}      label="Total Tests"    value={String(totalTests)} />
            <StatCard icon={CheckCircle2} label="Verified"       value={String(verified)}   tone="accent" />
            <StatCard icon={Clock}        label="In Progress"    value={String(inProgress)} tone="warning" />
            <StatCard icon={FileCheck2}   label="COAs Available" value={String(coasAvail)} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tests list */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Your Tests
                </CardTitle>
                <CardDescription>Most recent samples submitted to the lab.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10 text-muted-foreground gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Loading your reports...</span>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm gap-2">
                    <Package className="h-8 w-8 opacity-30" />
                    <p>No tests found for your account yet.</p>
                  </div>
                ) : (
                  reports.map((t: any) => {
                    const status = getStatus(t);
                    const hasCOA = !!t.retention_time;
                    return (
                      <div
                        key={t.report_id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-display font-semibold">{t.product_name}</span>
                            <Badge variant="outline" className={statusStyles[status]}>{status}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            ID {t.report_id} · {formatDate(t.analysis_completed_date)}
                          </div>
                        </div>
                        {hasCOA ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/verify-report/${t.report_id}`}>View COA <ArrowRight className="h-4 w-4" /></Link>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" disabled>Pending</Button>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Account card */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Your profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Row label="Name"    value={`${user.firstName} ${user.lastName}`} />
                  <Row label="Email"   value={user.email}   icon={Mail} />
                  <Row label="Company" value={user.company} icon={Building2} />
                  <Row label="Plan"    value={user.plan}    icon={ShieldCheck} />
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
  icon: Icon, label, value, tone = "primary",
}: { icon: any; label: string; value: string; tone?: "primary" | "accent" | "warning" }) => {
  const toneClass =
    tone === "accent"  ? "border-accent/30 bg-accent/10 text-accent" :
    tone === "warning" ? "border-warning/30 bg-warning/10 text-warning" :
                         "border-primary/30 bg-primary/10 text-primary";
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
