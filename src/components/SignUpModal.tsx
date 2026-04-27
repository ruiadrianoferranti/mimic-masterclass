import { useState, ReactNode } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Tag, ShieldCheck, Mail, Lock, User, Building2 } from "lucide-react";

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(60),
  lastName: z.string().trim().min(1, "Required").max(60),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(128),
  agree: z.literal(true, { errorMap: () => ({ message: "You must agree" }) }),
});

interface Props {
  trigger: ReactNode;
  defaultMode?: "signup" | "signin";
}

export const SignUpModal = ({ trigger, defaultMode = "signup" }: Props) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signup" | "signin">(defaultMode);
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    password: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
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
    toast({
      title: mode === "signup" ? "Account created" : "Welcome back",
      description: mode === "signup" ? "Check your email to confirm. 50% off applied to your first sample." : "You're signed in.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            HelixAnalyticals Account
          </div>
          <DialogTitle className="text-2xl font-bold">
            {mode === "signup" ? "Create your free account" : "Sign in to your account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? "Submit samples, track orders, and access HelixVerified COAs in one place."
              : "Access your dashboard, orders and verified reports."}
          </DialogDescription>
        </DialogHeader>

        {mode === "signup" && (
          <div className="inline-flex items-center gap-2 rounded-full border border-warning/60 bg-warning/10 px-3 py-1.5 text-xs">
            <Tag className="h-3.5 w-3.5 text-warning" />
            <span><span className="font-bold text-warning">50% OFF</span> your first sample — auto-applied</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field id="firstName" label="First name" icon={User} value={form.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
                <Field id="lastName" label="Last name" value={form.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
              </div>
              <Field id="company" label="Company (optional)" icon={Building2} value={form.company} onChange={(v) => update("company", v)} error={errors.company} />
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

          <Button type="submit" variant="hero" size="lg" className="w-full">
            {mode === "signup" ? "Create Free Account" : "Sign In"}
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
