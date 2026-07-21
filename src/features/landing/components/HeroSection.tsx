/**
 * Landing Page — Hero Section
 * SandboxBanner, SiteNav, Hero, FloatingPatterns, FloatingPreview
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { Logo } from "@/components/safer/Logo";
import { ThemeToggle } from "@/components/safer/ThemeToggle";
import { Tour } from "@/components/safer/Tour";

export function SandboxBanner() {
  return (
    <div className="bg-primary/10 border-b border-primary/20 text-xs text-primary py-2.5 px-4 text-center font-medium flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
      <span className="inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground tracking-wider shrink-0">
        Live Sandbox
      </span>
      <span>
        Evaluasi Terbatas untuk Fintech &amp; Perbankan Indonesia. Dilengkapi XGBoost + LightGBM Ensemble v2 &amp; Explainable AI.
      </span>
    </div>
  );
}

export function SiteNav({ onDemoRequest, isB2b }: { onDemoRequest: () => void; isB2b: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#platform" className="transition-colors hover:text-foreground">Platform</a>
          <a href="#preview" className="transition-colors hover:text-foreground">Dashboard</a>
          <a href="#integration" className="transition-colors hover:text-foreground">Integration</a>
          <a href="#compliance" className="transition-colors hover:text-foreground">Compliance</a>
          <a href="#business" className="transition-colors hover:text-foreground">Business</a>
          <a href="#ecosystem" className="transition-colors hover:text-foreground">Ecosystem</a>
        </nav>
        <div className="flex items-center gap-2">
          <Tour />
          <ThemeToggle />
          {isB2b && (
            <button
              onClick={onDemoRequest}
              className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-semibold hover:bg-accent transition-colors"
            >
              Request Demo
            </button>
          )}
          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open Console <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Hero({ onDemoRequest, isB2b }: { onDemoRequest: () => void; isB2b: boolean }) {
  return (
    <section className="relative overflow-hidden border-b border-border min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute inset-0 bg-radial-fade" />
      <FloatingPatterns />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="hero-enter inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Trusted by analyst teams across Indonesia's digital finance sector
          </div>
          <h1 className="hero-enter-delayed mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            <span className="text-display">AI Fraud Intelligence</span>
            <br />
            for Indonesia&apos;s Digital Financial Ecosystem
          </h1>
          <p className="hero-enter-delayed-2 mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            Helping financial institutions detect suspicious transactions, reduce fraud losses and improve investigation
            efficiency through explainable AI and graph intelligence.
          </p>
          <div className="hero-enter-delayed-3 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/simulator" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md">
              Try the Risk Simulator <ArrowRight className="h-4 w-4" />
            </Link>
            {isB2b ? (
              <button onClick={onDemoRequest} className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-accent">
                Request Demo &amp; API Key
              </button>
            ) : (
              <Link to="/dashboard" className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-accent">
                Open Demo Console
              </Link>
            )}
            <Link to="/resources" className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-transparent px-5 text-sm font-medium transition-colors hover:bg-accent/10">
              FDS Knowledge Hub
            </Link>
          </div>

          <div className="hero-enter-delayed-3 mt-12 grid grid-cols-2 gap-4 text-left md:grid-cols-4">
            {[
              { k: "98.6%", v: "Detection precision" },
              { k: "<120ms", v: "Decision latency" },
              { k: "−42%", v: "Fraud loss reduction" },
              { k: "24/7", v: "Realtime monitoring" },
            ].map((s) => (
              <div key={s.v} className="rounded-lg border border-border bg-card/60 p-4 backdrop-blur">
                <div className="num text-2xl font-semibold tracking-tight">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <FloatingPreview />
      </div>
    </section>
  );
}

function FloatingPatterns() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="float-y absolute left-[8%] top-[18%] rounded-lg border border-border bg-card/40 px-3 py-2 backdrop-blur-sm opacity-[0.35]" style={{ animationDelay: "0s" }}>
        <div className="text-[10px] text-muted-foreground">TX-84210</div>
        <div className="num text-xs font-medium">Rp 12.4M</div>
      </div>
      <div className="float-slow absolute right-[7%] top-[22%] rounded-lg border border-border bg-card/40 px-3 py-2 backdrop-blur-sm opacity-[0.3]" style={{ animationDelay: "1.2s" }}>
        <div className="text-[10px] text-muted-foreground">Score: 78</div>
        <div className="text-[10px] font-medium text-warning">High</div>
      </div>
      <div className="float-x absolute left-[12%] bottom-[28%] rounded-lg border border-border bg-card/40 px-3 py-2 backdrop-blur-sm opacity-[0.25]" style={{ animationDelay: "2s" }}>
        <div className="text-[10px] text-muted-foreground">BI-FAST</div>
        <div className="num text-xs font-medium">Rp 48.2M</div>
      </div>
      <div className="float-y absolute right-[10%] bottom-[20%] rounded-lg border border-border bg-card/40 px-3 py-2 backdrop-blur-sm opacity-[0.28]" style={{ animationDelay: "0.6s" }}>
        <div className="text-[10px] text-muted-foreground">QRIS Alert</div>
        <div className="text-[10px] font-medium text-destructive">Critical</div>
      </div>
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 1200 700">
        <circle cx="150" cy="200" r="4" fill="var(--primary)" className="glow-pulse" />
        <circle cx="350" cy="120" r="3" fill="var(--chart-2)" className="glow-pulse" style={{ animationDelay: "1s" }} />
        <circle cx="850" cy="180" r="4" fill="var(--primary)" className="glow-pulse" style={{ animationDelay: "2s" }} />
        <circle cx="1050" cy="280" r="3" fill="var(--chart-3)" className="glow-pulse" style={{ animationDelay: "0.5s" }} />
        <circle cx="200" cy="500" r="3" fill="var(--chart-4)" className="glow-pulse" style={{ animationDelay: "1.5s" }} />
        <circle cx="1000" cy="520" r="4" fill="var(--primary)" className="glow-pulse" style={{ animationDelay: "0.8s" }} />
        <line x1="150" y1="200" x2="350" y2="120" stroke="var(--primary)" strokeWidth="1" opacity="0.5" />
        <line x1="350" y1="120" x2="850" y2="180" stroke="var(--primary)" strokeWidth="1" opacity="0.3" />
        <line x1="850" y1="180" x2="1050" y2="280" stroke="var(--chart-2)" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="500" x2="1000" y2="520" stroke="var(--chart-3)" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
}

function FloatingPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl reveal">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="ml-3 font-mono text-[11px] text-muted-foreground">safer.console / monitoring</div>
        </div>
        <div className="grid grid-cols-3 gap-px bg-border">
          {[
            { l: "Transactions today", v: "1,284,902", t: "+8.4%", icon: TrendingUp, tone: "text-success" },
            { l: "Flagged events", v: "3,471", t: "0.27% rate", icon: AlertTriangle, tone: "text-warning" },
            { l: "Blocked losses", v: "Rp 9.2 B", t: "this month", icon: ShieldCheck, tone: "text-primary" },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.l} className="bg-card p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.l}</span>
                  <Icon className={`h-4 w-4 ${c.tone}`} />
                </div>
                <div className="num mt-2 text-2xl font-semibold">{c.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.t}</div>
              </div>
            );
          })}
        </div>
        <div className="bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Live alert stream</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Streaming
            </div>
          </div>
          <div className="space-y-2">
            {[
              { id: "TX-99214", reason: "Velocity anomaly + new device", sev: "critical", amount: "Rp 48,200,000" },
              { id: "TX-99213", reason: "QRIS merchant risk score elevated", sev: "high", amount: "Rp 12,750,000" },
              { id: "TX-99212", reason: "Geolocation mismatch (Jakarta → Medan, 4 min)", sev: "medium", amount: "Rp 3,400,000" },
            ].map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${a.sev === "critical" ? "bg-critical" : a.sev === "high" ? "bg-destructive" : "bg-warning"}`} />
                  <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
                  <span>{a.reason}</span>
                </div>
                <span className="num text-xs text-muted-foreground">{a.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
