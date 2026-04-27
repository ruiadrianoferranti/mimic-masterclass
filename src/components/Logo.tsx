import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="relative h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-soft">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" strokeWidth="2.5" stroke="currentColor">
        <path d="M3 20L12 4l9 16M7 14h10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <span className="font-display text-xl font-bold tracking-tight">
      <span className="text-gradient">Verita</span>
      <span className="text-foreground">Pep</span>
      <span className="text-muted-foreground font-normal ml-1">Labs</span>
    </span>
  </Link>
);
