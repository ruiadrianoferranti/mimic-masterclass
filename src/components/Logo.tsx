import { Beaker } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <a href="#" className={`flex items-center gap-2 group ${className}`}>
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="relative h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
        <Beaker className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      </div>
    </div>
    <div className="font-display text-xl font-bold tracking-tight">
      Verita<span className="text-gradient">Pep</span>
      <span className="text-muted-foreground font-medium ml-1">Labs</span>
    </div>
  </a>
);
