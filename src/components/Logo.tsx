import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="relative h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-soft">
      {/* DNA helix icon */}
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3c0 5 14 5 14 9s-14 4-14 9" />
        <path d="M19 3c0 5-14 5-14 9s14 4 14 9" />
        <path d="M7 5h10" />
        <path d="M8 9h8" />
        <path d="M8 15h8" />
        <path d="M7 19h10" />
      </svg>
    </div>
    <span className="font-display text-xl font-bold tracking-tight">
      <span className="text-gradient">Helix</span>
      <span className="text-foreground">Analyticals</span>
    </span>
  </Link>
);
