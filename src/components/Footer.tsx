import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="border-t border-border bg-secondary/30">
    <div className="container py-14 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <Logo />
        <p className="mt-4 text-sm text-muted-foreground max-w-sm">
          Independent peptide testing with cryptographically verifiable results. US-based laboratory with 48-72 hour turnaround.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Company</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/services" className="hover:text-primary">Services</Link></li>
          <li><Link to="/trust-problem#trust-problem" className="hover:text-primary">The Trust Problem</Link></li>
          <li><Link to="/verify" className="hover:text-primary">Verify a Report</Link></li>
          <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Contact</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>info@helixanalyticals.com</li>
          <li>US-based laboratory</li>
          <li>ISO 17025 Pending</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} HelixAnalyticals. All rights reserved.</p>
        <p>HelixVerify™ is a trademark of HelixAnalyticals.</p>
      </div>
    </div>
  </footer>
);
