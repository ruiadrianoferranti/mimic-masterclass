import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2 } from "lucide-react";

const VerifyPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => {
      navigate(`/verify-report/${encodeURIComponent(code.trim().toUpperCase())}`);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-24 md:py-32 bg-gradient-verify border-b border-border min-h-[80vh] flex items-center">
          <div className="container max-w-xl">
            <div className="text-center mb-10">
              <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Verify HelixAnalyticals Certificate</h1>
              <p className="text-muted-foreground">Enter the verification code from your Certificate of Analysis to confirm its authenticity.</p>
            </div>
            <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-border p-8 shadow-elegant space-y-4">
              <label className="text-sm font-medium">Verification Code</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 8Z8G-MRJB"
                className="h-14 text-lg font-mono uppercase tracking-wider"
                disabled={loading}
              />
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Verifying certificate...</>) : "Verify Certificate"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Try sample code: <button type="button" className="font-mono text-primary underline" onClick={() => setCode("8Z8G-MRJB")}>8Z8G-MRJB</button></p>
            </form>
          </div>
        </section>
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default VerifyPage;
