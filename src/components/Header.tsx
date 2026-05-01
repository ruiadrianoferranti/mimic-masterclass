import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Menu, ShoppingCart, User, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpModal } from "./SignUpModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "The Trust Problem", href: "/trust-problem" },
  { label: "Contact", href: "/contact" },
  { label: "Verify COA", href: "/verify" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const stored = localStorage.getItem("helix_user");
  const loggedUser = stored ? JSON.parse(stored) : null;

  const handleSignOut = () => {
    localStorage.removeItem("helix_user");
    navigate("/");
    // Force re-render by reloading
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              end={l.href === "/"}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingCart className="h-4 w-4" />
          </Button>

          {loggedUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary" aria-label="Account menu">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {loggedUser.firstName} {loggedUser.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {loggedUser.email}
                    </p>
                    {loggedUser.company && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {loggedUser.company}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignUpModal
              defaultMode="signin"
              trigger={
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary" aria-label="Account">
                  <User className="h-4 w-4" />
                </Button>
              }
            />
          )}

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
