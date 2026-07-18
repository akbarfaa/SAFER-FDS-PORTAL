import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Search,
  Network,
  ShieldCheck,
  Cpu,
  Briefcase,
  ArrowLeft,
  Menu,
  X,
  ClipboardList,
  Settings,
  Code,
  BookOpen,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Tour } from "./Tour";
import { SettingsModal } from "./SettingsModal";
import { useTransactionActions } from "@/lib/transaction-store";
import { useTranslation } from "@/lib/i18n";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/dashboard", labelKey: "nav.monitoring", icon: LayoutDashboard, groupKey: "nav.operations" },
  { to: "/audit", labelKey: "nav.auditQueue", icon: ClipboardList, groupKey: "nav.operations" },
  { to: "/simulator", labelKey: "nav.riskSimulator", icon: Search, groupKey: "nav.operations" },
  { to: "/network", labelKey: "nav.fraudGraph", icon: Network, groupKey: "nav.operations" },
  { to: "/compliance", labelKey: "nav.compliance", icon: ShieldCheck, groupKey: "nav.governance" },
  { to: "/resources", labelKey: "nav.resources", icon: BookOpen, groupKey: "nav.governance" },
  { to: "/developer", labelKey: "nav.sandbox", icon: Code, groupKey: "nav.platform" },
  { to: "/architecture", labelKey: "nav.architecture", icon: Cpu, groupKey: "nav.platform" },
  { to: "/business", labelKey: "nav.businessModel", icon: Briefcase, groupKey: "nav.platform" },
] as const;

import { RoleSwitcher } from "./RoleSwitcher";

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  // Read B2B mode state
  const isB2b = typeof window !== "undefined" ? (localStorage.getItem("safer_b2b_enabled") === "true") : false;
  
  // Read role from localStorage
  const savedRole = typeof window !== "undefined" 
    ? (isB2b ? (localStorage.getItem("safer_role") || "admin") : "admin") 
    : "admin";
  
  // Filter navigation items based on active simulation role
  const filteredNav = NAV.filter((item) => {
    if (!isB2b) return true; // Show all to judges in public mode
    if (savedRole === "analyst") {
      return item.groupKey === "nav.operations";
    }
    if (savedRole === "compliance") {
      return item.groupKey === "nav.operations" || item.groupKey === "nav.governance";
    }
    return true; // admin
  });

  const groups = Array.from(new Set(filteredNav.map((n) => n.groupKey)));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  let pendingCount = 0;
  try {
    const actions = useTransactionActions();
    pendingCount = actions.stats.pendingReview;
  } catch { /* ignore if not within provider */ }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <Logo />
        {isMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {groups.map((g) => (
          <div key={g} className="mb-5">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t(g)}
            </div>
            <ul className="space-y-0.5">
              {filteredNav.filter((n) => n.groupKey === g).map((n) => {
                const active = pathname === n.to;
                const Icon = n.icon;
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${active
                          ? "bg-sidebar-accent text-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t(n.labelKey)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="rounded-md border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium">{t('appShell.engineOnline')}</span>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            v2.4.1 · jakarta-1 · {t('appShell.lastSync')} 12s ago
          </p>
        </div>
        <div className="rounded-md border border-warning/20 bg-warning/5 p-3 text-[10px] leading-relaxed text-muted-foreground">
          <span className="font-bold text-warning">{t('appShell.disclaimerTitle')}</span> {t('appShell.disclaimerText')}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-surface">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative flex w-64 flex-col bg-sidebar border-r border-sidebar-border shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur">
          <div className="min-w-0 flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
                  <ArrowLeft className="h-3 w-3" />
                  Home
                </Link>
                <span>/</span>
                <span className="truncate">{title}</span>
              </div>
              <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {subtitle && <span className="hidden text-xs text-muted-foreground md:inline">{subtitle}</span>}
            {pendingCount > 0 && (
              <Link to="/audit" className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning/10 px-2.5 py-1 text-[11px] text-warning hover:bg-warning/20 transition-colors">
                <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                {pendingCount} pending
              </Link>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-md border border-border hover:bg-accent transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
            <Tour />
            <LanguageToggle />
            <ThemeToggle />
            <div className="hidden h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs md:flex">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
                AN
              </div>
              <div className="leading-tight">
                <div className="font-medium">{t('appShell.analystDemo')}</div>
                <div className="text-[10px] text-muted-foreground">Fraud Ops</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-6 py-6">{children}</main>
      </div>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {isB2b && <RoleSwitcher />}
    </div>
  );
}
