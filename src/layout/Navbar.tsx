import { Building2, LayoutDashboard, ShieldCheck, Store } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Marketplace", icon: Store },
  { to: "/member", label: "Member", icon: LayoutDashboard },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight">
              KGS PropTech
            </div>
            <div className="text-[11px] text-muted-foreground">
              Property Marketplace
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeClassName="!bg-secondary !text-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link to="/member/submit">Đăng tin</Link>
        </Button>
      </div>
    </header>
  );
}
