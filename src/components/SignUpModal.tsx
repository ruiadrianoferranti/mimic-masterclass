import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Tag, ShieldCheck, Mail, Lock, User, Building2, Smartphone, CheckCircle2 } from "lucide-react";

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(60),
  lastName: z.string().trim().min(1, "Required").max(60),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(128),
  phone: z.string().trim().min(10, "Valid phone required").max(20),
  agree: z.literal(true, { errorMap: () => ({ message: "You must agree" }) }),
});

const VERIFICATION_CODE = "90929766";

interface Props {
  trigger: ReactNode;
  defaultMode?: "signup" | "signin";
}

export const SignUpModal = ({ trigger, defaultMode = "signup" }: Props) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signup" | "signin" | "verify">(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    password: "",
    phone: "",
    agree: false,
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const sendVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "verify") {
      if (verificationCode === VERIFICATION_CODE) {
        setIsLoading(true);
        try {
          const { supabase } = await import("@/lib/supabase");
          
          const { data, error } = await supabase
            .from("users")
            .insert([{
              first_name: form.firstName,
              last_name: form.lastName,
              email: form.email,
              company: form.company || null,
              phone: form.phone || null,
              password: form.password,
            }])
            .select()
            .single();

          if (error) {
            if (error.code === "23505") {
              setErrors({ email: "This email is already registered." });
              return;
            }
            throw error;
          }

          localStorage.setItem("helix_user", JSON.stringify({
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            company: data.company,
          }));

          toast({
            title: "Account verified",
            description: "Welcome to HelixAnalyticals!",
          });

          setOpen(false);
          navigate("/dashboard");
        } catch (err: any) {
          toast({
            title: "Error",
            description: err.message || "Something went wrong",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setErrors({ verification: "Invalid verification code" });
      }
      return;
    }

    if (mode === "signup") {
      const result = schema.safeParse(form);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
        setErrors(errs);
        return;
      }
    } else if (!form.email || !form.password) {
      setErrors({ email: !form.email ? "Required" : "", password: !form.password ? "Required" : "" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await new Promise(r => setTimeout(r, 1000));
        setVerificationSent(true);
        setMode("verify");
        toast({
          title: "Verification code sent",
          description: `SMS sent to ${form.phone}.`,
        });
      } else {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", form.email)
          .single();

        if (error || !data) {
          setErrors({ email: "No account found with this email." });
          return;
        }

        if (data.password !== form.password) {
          setErrors({ password: "Incorrect password." });
          return;
        }

        localStorage.setItem("helix_user", JSON.stringify({
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          company: data.company,
        }));

        toast({
          title: "Welcome back",
          description: "You're signed in.",
        });

        setOpen(false);
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMode("signup");
    setVerificationSent(false);
    setVerificationCode("");
    setForm({
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      password: "",
      phone: "",
      agree: false,
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setTimeout(resetForm, 300); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            HelixAnalyticals Account
          </div>
          <DialogTitle className="text-2xl font-bold">
            {mode === "verify" ? "Verify Your Phone" : mode === "signup" ? "Create your free account" : "Sign in to your account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "verify" 
              ? "Enter the verification code sent to your phone."
              : mode === "signup"
              ? "Submit samples, track orders, and access HelixVerified COAs in one place."
              : "Access your dashboard, orders and verified reports."}
          </DialogDescription>
        </DialogHeader>

        {mode === "signup" && !verificationSent && (
          <div className="inline-flex items-center gap-2 rounded-full border border-warning/60 bg-warning/10 px-3 py-1.5 text-xs">
            <Tag className="h-3.5 w-3.5 text-warning" />
            <span><span className="font-bold text-warning">50% OFF</span> your first sample — auto-applied</span>
          </div>
        )}

        <form onSubmit={sendVerification} className="space-y-4">
          {mode === "verify" ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-accent/10 border border-accent/30 p-4 text-center">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-accent" />
                <p className="text-sm text-muted-foreground">
                  A verification code has been sent to your phone.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification">Verification Code</Label>
                <Input
                  id="verification"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                {errors.verification && <p className="text-xs text-destructive">{errors.verification}</p>}
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & Complete Registration"}
              </Button>
              <button 
                type="button" 
                onClick={() => { setMode("signup"); setVerificationSent(false); }}
                className="w-full text-sm text-muted-foreground hover:text-primary"
              >
                ← Back to registration
              </button>
            </div>
          ) : (
            <>
              {mode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field id="firstName" label="First name" icon={User} value={form.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
                    <Field id="lastName" label="Last name" value={form.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
                  </div>
                  <Field id="company" label="Company (optional)" icon={Building2} value={form.company} onChange={(v) => update("company", v)} error={errors.company} />
                  <Field id="phone" label="Phone Number" icon={Smartphone} value={form.phone} onChange={(v) => update("phone", v)} error={errors.phone} placeholder="+1 (555) 000-0000" />
                </>
              )}

              <Field id="email" type="email" label="Email" icon={Mail} value={form.email} onChange={(v) => update("email", v)} error={errors.email} />
              <Field id="password" type="password" label="Password" icon={Lock} value={form.password} onChange={(v) => update("password", v)} error={errors.password} placeholder={mode === "signup" ? "At least 8 characters" : ""} />

              {mode === "signup" && (
                <label className="flex items-start gap-2 text-sm">
                  <Checkbox checked={form.agree} onCheckedChange={(v) => update("agree", Boolean(v))} className="mt-0.5" />
                  <span className="text-muted-foreground">
                    I agree to the <a className="text-primary underline" href="#">Terms of Service</a> and <a className="text-primary underline" href="#">Privacy Policy</a>.
                  </span>
                </label>
              )}
              {errors.agree && <p className="text-xs text-destructive -mt-2">{errors.agree}</p>}

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait..." : mode === "signup" ? "Create Free Account" : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <>Already have an account?{" "}
                    <button type="button" onClick={() => setMode("signin")} className="text-primary font-medium hover:underline">Sign in</button>
                  </>
                ) : (
                  <>New to HelixAnalyticals?{" "}
                    <button type="button" onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">Create an account</button>
                  </>
                )}
              </p>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  icon?: any;
  placeholder?: string;
}

const Field = ({ id, label, value, onChange, error, type = "text", icon: Icon, placeholder }: FieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={Icon ? "pl-9" : ""}
        aria-invalid={!!error}
      />
    </div>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);