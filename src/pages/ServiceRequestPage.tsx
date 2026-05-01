import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle2, Package, ArrowLeft, Lock, ChevronDown, X, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SignUpModal } from "@/components/SignUpModal";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const serviceTypes = [
  { value: "core", label: "Core Panel - $250/sample", description: "Identity, Purity & Quantity" },
  { value: "helixshield", label: "HelixShield Panel - $578/sample", description: "Core + Full Biosafety Suite" },
  { value: "custom", label: "Custom Quote", description: "Tailored to your needs" },
];

const peptides = [
  "AICAR", "AOD-9604", "BPC-157", "Cagrilintide", "CJC-1295 (no DAC)", 
  "Delta Sleep-Inducing Peptide", "Epitalon", "Epithalon", "GHK-Cu", "GHRP-6", 
  "Hexarelin", "IGF-1 LR3", "Ipamorelin", "Kisspeptin-10", "KPV", "Liraglutide", 
  "LL-37", "Melanotan I", "Melanotan II", "MOTS-c", "MTP 131", "NAD+", 
  "Pinealon", "PT-141", "Retatrutide", "Selank", "Semaglutide", "Semax", 
  "Sermorelin", "SLU-PP-332", "TB500 (17-23 Fragment)", "TB500 (Thymosin Beta 4)", 
  "Tesamorelin", "Testagen", "Thymosin Alpha-1", "Thymosin Beta-4", "Thymulin", 
  "Tirzepatide", "Triptorelin", "VIP"
];

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

const PeptideSelect = ({ 
  selected, 
  onChange,
  otherValue,
  onOtherChange,
  showOther,
  onShowOtherChange
}: { 
  selected: string[]; 
  onChange: ( peptides: string[] ) => void;
  otherValue: string;
  onOtherChange: (value: string) => void;
  showOther: boolean;
  onShowOtherChange: (show: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredPeptides = peptides.filter(p => 
    p.toLowerCase().includes(search.toLowerCase())
  );

  const togglePeptide = (peptide: string) => {
    if (selected.includes(peptide)) {
      onChange(selected.filter(p => p !== peptide));
    } else {
      onChange([...selected, peptide]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-auto min-h-[44px] text-left font-normal"
        >
          {selected.length === 0 ? (
            <span className="text-muted-foreground">Select peptide(s) from the list</span>
          ) : (
            <span className="truncate">
              {selected.length === 1 
                ? selected[0] 
                : `${selected.length} peptide${selected.length > 1 ? "s" : ""} selected`}
            </span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search peptides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="max-h-[250px] overflow-y-auto p-2">
          {filteredPeptides.map((peptide) => (
            <label
              key={peptide}
              className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent cursor-pointer"
            >
              <Checkbox
                checked={selected.includes(peptide)}
                onCheckedChange={() => togglePeptide(peptide)}
              />
              <span className="text-sm">{peptide}</span>
            </label>
          ))}
          <label
            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent cursor-pointer border-t mt-1 pt-3"
          >
            <Checkbox
              checked={showOther}
              onCheckedChange={(checked) => onShowOtherChange(Boolean(checked))}
            />
            <span className="text-sm font-medium">Other (specify below)</span>
          </label>
        </div>
        {selected.length > 0 && (
          <div className="border-t p-2 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                onChange([]);
                onShowOtherChange(false);
                onOtherChange("");
              }}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const ServiceRequestPage = () => {
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedPeptides, setSelectedPeptides] = useState<string[]>([]);
  const [otherPeptide, setOtherPeptide] = useState("");
  const [showOther, setShowOther] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [batchLot, setBatchLot] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("helix_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const generateId = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 4; i++) result += chars[Math.floor(Math.random() * chars.length)];
    for (let i = 0; i < 4; i++) result += (i === 2 ? "-" : "") + chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const allPeptides = [
      ...selectedPeptides,
      ...(showOther && otherPeptide ? [otherPeptide] : [])
    ];
    
    if (allPeptides.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one peptide",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (!batchLot.trim()) {
        toast({
          title: "Error",
          description: "Please enter the batch/lot number",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const { error } = await supabase.from("reports").insert([{
        report_id: generateId(),
        client_name: `${user.firstName} ${user.lastName}`,
        batch_lot: batchLot.trim(),
        product_name: allPeptides.join(", "),
        user_email: user.email,
        expected_quantity: parseInt(quantity) || 1,
        sample_received_date: null,
        purity_result: null,
        identity_result: null,
        quantity_result: null,
      }]);
      if (error) throw error;
      
      setSent(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit order",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePeptideChange = (peptides: string[]) => {
    setSelectedPeptides(peptides);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <section className="py-20 md:py-28 bg-gradient-verify border-b border-border">
            <div className="container max-w-2xl">
              <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Services
              </Link>
              <div className="text-center">
                <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">Order Request</div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Sign In to Request a Sample Kit</h1>
                <p className="text-lg text-muted-foreground">
                  You need an account to request sample collection kits.
                </p>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container max-w-md">
              <div className="rounded-2xl bg-card border border-border p-8 text-center shadow-soft">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Account Required</h2>
                <p className="text-muted-foreground mb-6">
                  Create a free account or sign in to request sample kits and track your orders.
                </p>
                <SignUpModal 
                  trigger={<Button variant="hero" size="lg" className="w-full">Create Free Account / Sign In</Button>}
                />
                <p className="text-xs text-muted-foreground mt-4">
                  New accounts get 50% off their first sample!
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-20 md:py-28 bg-gradient-verify border-b border-border">
          <div className="container max-w-2xl">
            <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Services
            </Link>
            <div className="text-center">
              <div className="text-xs font-mono tracking-widest text-primary uppercase mb-4">Order Request</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Request a Sample Kit</h1>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we'll send you a sample collection kit with everything you need.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container max-w-2xl">
            {sent ? (
              <div className="rounded-2xl bg-card border border-accent/40 p-10 text-center shadow-soft">
                <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest. Our team will review your request and contact you within 24-48 hours with kit shipping details.
                </p>
                <Button asChild variant="hero">
                  <Link to="/services">Back to Services</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-border p-8 space-y-6 shadow-soft">
                <div className="rounded-lg bg-accent/10 border border-accent/30 p-4 text-sm">
                  <span className="text-muted-foreground">Account: </span>
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                  <span className="text-muted-foreground"> · {user.email}</span>
                  {user.company && <><span className="text-muted-foreground"> · </span><span>{user.company}</span></>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Service Package *</label>
                  <select 
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Choose your testing package</option>
                    {serviceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Batch / Lot Number *</label>
                  <Input 
                    value={batchLot}
                    onChange={(e) => setBatchLot(e.target.value)}
                    placeholder="Enter your product batch/lot number"
                    required
                    className="h-11" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Peptide(s) to Test *</label>
                  <PeptideSelect 
                    selected={selectedPeptides} 
                    onChange={handlePeptideChange}
                    otherValue={otherPeptide}
                    onOtherChange={setOtherPeptide}
                    showOther={showOther}
                    onShowOtherChange={setShowOther}
                  />
                  {showOther && (
                    <Input 
                      placeholder="Enter peptide name(s)" 
                      value={otherPeptide}
                      onChange={(e) => setOtherPeptide(e.target.value)}
                      className="h-11 mt-2"
                    />
                  )}
                  {(selectedPeptides.length > 0 || showOther) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPeptides.map((p) => (
                        <span 
                          key={p} 
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs"
                        >
                          {p}
                          <button 
                            type="button" 
                            onClick={() => handlePeptideChange(selectedPeptides.filter(pe => pe !== p))}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {showOther && otherPeptide && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 border border-warning/30 px-3 py-1 text-xs">
                          {otherPeptide}
                          <button 
                            type="button" 
                            onClick={() => {
                              setShowOther(false);
                              setOtherPeptide("");
                            }}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity (number of samples) *</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required 
                    className="h-11 w-32" 
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to our terms. We'll contact you before shipping.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceRequestPage;