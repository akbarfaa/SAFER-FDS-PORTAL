import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Activity,
  Network,
  Brain,
  Lock,
  Zap,
  GitBranch,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Globe,
  Layers,
  Workflow,
} from "lucide-react";
import { Logo } from "@/components/safer/Logo";
import { ThemeToggle } from "@/components/safer/ThemeToggle";
import { Tour } from "@/components/safer/Tour";
import { useReveal } from "@/hooks/useReveal";
import { useState } from "react";
import { LeadRegistrationModal } from "@/components/safer/LeadRegistrationModal";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "SAFER — Smart AI Fraud & Economic Risk Intelligence Platform" },
      {
        name: "description",
        content:
          "Enterprise AI Fraud Detection System (FDS) for Indonesian banks, digital banking, and fintech. Real-time transaction scoring under 150ms, Explainable AI, and Graph Intelligence.",
      },
      {
        name: "keywords",
        content:
          "fraud detection system, fds perbankan, AI fraud intelligence, uu pdp compliance, bi-fast fraud prevention, qris fraud detection, mule accounts, rekening bagong, graph intelligence",
      },
      { property: "og:title", content: "SAFER — Smart AI Fraud & Economic Risk Intelligence" },
      {
        property: "og:description",
        content: "Stop payment fraud and money laundering in real-time with explainable AI and network graph intelligence built for Indonesia's digital finance.",
      },
      { property: "og:image", content: "https://safer.web.id/og-image.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SAFER — Smart AI Fraud & Economic Risk Intelligence" },
      { name: "twitter:description", content: "Real-time AI Fraud Detection System for Indonesia's digital banking and fintech ecosystems." },
      { name: "twitter:image", content: "https://safer.web.id/og-image.png" },
    ],
  }),
  component: Landing,
});

function SandboxBanner() {
  return (
    <div className="bg-primary/10 border-b border-primary/20 text-xs text-primary py-2.5 px-4 text-center font-medium flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
      <span className="inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground tracking-wider shrink-0">
        Live Sandbox
      </span>
      <span>
        Evaluasi Terbatas untuk Fintech & Perbankan Indonesia. Dilengkapi XGBoost + LightGBM Ensemble v2 & Explainable AI.
      </span>
    </div>
  );
}

function Landing() {
  const pageRef = useReveal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <SandboxBanner />
      <SiteNav onDemoRequest={() => setIsModalOpen(true)} />
      <Hero onDemoRequest={() => setIsModalOpen(true)} />
      <ProblemSection />
      <CapabilitiesSection />
      <DashboardPreview />
      <IntegrationFlow />
      <RegulatorySection />
      <BusinessSection />
      <EcosystemVision />
      <CTA onDemoRequest={() => setIsModalOpen(true)} />
      <Footer />
      <LeadRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function SiteNav({ onDemoRequest }: { onDemoRequest: () => void }) {
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
          <button
            onClick={onDemoRequest}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-semibold hover:bg-accent transition-colors"
          >
            Request Demo
          </button>
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

/* ═══════════════════ Hero ═══════════════════ */

function Hero({ onDemoRequest }: { onDemoRequest: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute inset-0 bg-radial-fade" />

      {/* Floating transaction / network patterns */}
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
            <Link
              to="/simulator"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Try the Risk Simulator <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={onDemoRequest}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-accent"
            >
              Request Demo & API Key
            </button>
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-transparent px-5 text-sm font-medium transition-colors hover:bg-accent/10"
            >
              View Live Dashboard
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

/* Floating animated SVG transaction & network patterns */
function FloatingPatterns() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Transaction card fragments */}
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

      {/* Network connection lines (SVG) */}
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
              <div
                key={a.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2.5 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      a.sev === "critical" ? "bg-critical" : a.sev === "high" ? "bg-destructive" : "bg-warning"
                    }`}
                  />
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

/* ═══════════════════ Problem ═══════════════════ */

function ProblemSection() {
  return (
    <section className="border-b border-border bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead
          eyebrow="The Problem"
          title="Rule-based fraud systems can't keep up with Indonesia's transaction velocity"
          subtitle="Static rules generate noise, miss new patterns, and force analysts into reactive investigation. Modern fraud is adaptive — defense needs to be too."
          className="reveal"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: AlertTriangle,
              title: "High false positives",
              body: "Legacy rule engines flag 30–60% legitimate traffic, eroding customer trust and overwhelming ops teams.",
            },
            {
              icon: Activity,
              title: "Blind to coordinated attacks",
              body: "Mule networks, device farms and QRIS abuse stay invisible without behavioral graph context.",
            },
            {
              icon: GitBranch,
              title: "Long investigation cycles",
              body: "Manual triage across siloed logs delays decisions and increases recovery cost per incident.",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className={`reveal reveal-delay-${i + 1} rounded-lg border border-border bg-card p-6`}>
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ Capabilities ═══════════════════ */

function CapabilitiesSection() {
  const items = [
    { icon: Brain, title: "Explainable AI scoring", body: "Every decision returns weighted indicators in plain language — auditable for analysts and regulators." },
    { icon: Activity, title: "Real-time monitoring", body: "Sub-150ms scoring for QRIS, BI-FAST, e-wallet and card rails at national-scale throughput." },
    { icon: Network, title: "Fraud graph intelligence", body: "Connect accounts, devices and merchants to surface mule rings before losses accumulate." },
    { icon: ShieldCheck, title: "Compliance-by-design", body: "PDP-aligned data handling, RBAC, immutable audit logs and anonymized model inputs." },
    { icon: Zap, title: "API integration layer", body: "Drop-in REST and streaming endpoints — production integration in under two weeks." },
    { icon: Lock, title: "Sovereign deployment", body: "Run in shared SaaS, private VPC or fully on-premise to meet OJK and internal risk policies." },
  ];
  return (
    <section id="platform" className="border-b border-border min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead
          eyebrow="Platform"
          title="A complete fraud intelligence stack — not a black box"
          subtitle="SAFER combines deterministic risk scoring, ML behavioral models and graph analytics into one operational platform."
          className="reveal"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className={`reveal reveal-delay-${(i % 3) + 1} group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ Dashboard Preview ═══════════════════ */

function DashboardPreview() {
  return (
    <section id="preview" className="border-b border-border bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead
          eyebrow="Operational Console"
          title="Built for fraud analysts, not for dashboards"
          subtitle="Triage queues, investigation timelines and graph drilldowns designed around how SOC and fraud ops teams actually work."
          className="reveal"
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="reveal space-y-5">
            {[
              "Unified queue across rails — QRIS, BI-FAST, e-wallet, card.",
              "Per-transaction explanation: indicators, weights, peer comparison.",
              "One-click escalation with full case packet for compliance review.",
              "Configurable risk policies with shadow-mode evaluation.",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                <p className="text-sm leading-relaxed">{line}</p>
              </div>
            ))}
            <Link
              to="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open monitoring dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="reveal reveal-delay-2">
            <PremiumDashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PremiumDashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
      {/* Mac window header */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/40" />
        </div>
        <div className="ml-3 font-mono text-[11px] text-muted-foreground">safer.console / monitoring</div>
      </div>

      {/* Grid: 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-px bg-border">
        {[
          { l: "Transactions today", v: "1,284,902", t: "+8.4%", icon: TrendingUp, tone: "text-success" },
          { l: "Flagged events", v: "3,471", t: "0.27% rate", icon: AlertTriangle, tone: "text-warning" },
          { l: "Blocked losses", v: "Rp 9.2 B", t: "this month", icon: ShieldCheck, tone: "text-primary" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.l} className="bg-card p-4">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="truncate max-w-[80px] sm:max-w-none">{c.l}</span>
                <Icon className={`h-3.5 w-3.5 ${c.tone} flex-shrink-0`} />
              </div>
              <div className="num mt-1.5 text-lg sm:text-xl font-bold tracking-tight">{c.v}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{c.t}</div>
            </div>
          );
        })}
      </div>

      {/* Bottom section: Split Alerts & Charts */}
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
        {/* Column 1: Live Alerts Stream */}
        <div className="bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live alert stream</div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Streaming
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              { id: "TX-99214", reason: "Velocity anomaly + new device", sev: "critical", amount: "Rp 48.2M" },
              { id: "TX-99213", reason: "QRIS risk elevated", sev: "high", amount: "Rp 12.7M" },
              { id: "TX-99212", reason: "Geolocation mismatch", sev: "medium", amount: "Rp 3.4M" },
            ].map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded border border-border bg-surface px-2.5 py-1.5 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                      a.sev === "critical" ? "bg-critical" : a.sev === "high" ? "bg-destructive" : "bg-warning"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-muted-foreground flex-shrink-0">{a.id}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{a.reason}</span>
                </div>
                <span className="num text-[10px] text-muted-foreground pl-1 flex-shrink-0">{a.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Beautiful SVG Area Chart */}
        <div className="bg-card p-4 flex flex-col justify-between">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Risk trend (14d)</div>
            <div className="text-[10px] text-primary font-semibold">Peak: 84%</div>
          </div>
          
          {/* Custom SVG Line & Area chart */}
          <div className="relative h-20 w-full mt-1">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              
              {/* Area path */}
              <path
                d="M 0 35 Q 10 25, 20 28 T 40 15 T 60 20 T 80 10 T 100 5 L 100 40 L 0 40 Z"
                fill="url(#chartGradient)"
              />
              {/* Line path */}
              <path
                d="M 0 35 Q 10 25, 20 28 T 40 15 T 60 20 T 80 10 T 100 5"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Highlight Circle */}
              <circle cx="80" cy="10" r="1.5" fill="var(--primary)" className="animate-pulse" />
            </svg>
          </div>
          
          {/* Chart X Axis Labels */}
          <div className="mt-1.5 flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>05 Jul</span>
            <span>09 Jul</span>
            <span>13 Jul</span>
            <span>17 Jul</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ Integration Flow ═══════════════════ */

function IntegrationFlow() {
  const steps = [
    { icon: Layers, label: "Client App", sub: "Mobile · Web · Internal" },
    { icon: Lock, label: "API Gateway", sub: "mTLS · OAuth · Rate limits" },
    { icon: Brain, label: "AI Scoring Engine", sub: "Deterministic + ML" },
    { icon: Network, label: "Graph Intelligence", sub: "Neo4j · Account links" },
    { icon: Workflow, label: "Alert Router", sub: "Queue · Escalation" },
    { icon: ShieldCheck, label: "Compliance Layer", sub: "Audit · Report · PDP" },
  ];

  return (
    <section id="integration" className="border-b border-border min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead
          eyebrow="Integration"
          title="Drop-in API integration — production-ready in under two weeks"
          subtitle="A single REST call returns risk score, explainability, severity and suggested action. Streaming webhooks for real-time monitoring."
          className="reveal"
        />
        <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-2 md:gap-0">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center">
                <div className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center w-36 md:w-40">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-xs font-semibold">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.sub}</div>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="mx-1 h-4 w-4 shrink-0 text-muted-foreground hidden md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ Regulatory ═══════════════════ */

function RegulatorySection() {
  return (
    <section id="compliance" className="border-b border-border bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead
          eyebrow="Compliance"
          title="Aligned with OJK, Bank Indonesia and UU PDP"
          subtitle="Security and governance controls designed for regulated financial institutions, not bolted on after the fact."
          className="reveal"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            { t: "UU PDP", s: "Data protection alignment" },
            { t: "OJK POJK 11", s: "IT risk management" },
            { t: "BI Anti-Fraud", s: "Reporting workflow" },
            { t: "ISO 27001", s: "Information security" },
          ].map((c, i) => (
            <div key={c.t} className={`reveal reveal-delay-${i + 1} rounded-lg border border-border bg-card p-5`}>
              <div className="text-sm font-semibold">{c.t}</div>
              <div className="text-xs text-muted-foreground">{c.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ Business ═══════════════════ */

function BusinessSection() {
  return (
    <section id="business" className="border-b border-border min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead
          eyebrow="Business"
          title="Built for Indonesia's tiered financial market"
          subtitle="From tier-2 fintechs to enterprise banks and regulator consortia — SAFER scales pricing and deployment with you."
          className="reveal"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { tier: "Phase 1", who: "Fintech & E-wallet", what: "API-first SaaS, usage-based pricing.", icon: Zap },
            { tier: "Phase 2", who: "Regional banks & BPR", what: "Private deployment with managed ops.", icon: Building2 },
            { tier: "Phase 3", who: "Enterprise & Regulators", what: "Consortium intelligence sharing.", icon: ShieldCheck },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={c.tier} className={`reveal reveal-delay-${i + 1} rounded-lg border border-border bg-card p-6`}>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">{c.tier}</div>
                <div className="mt-2 flex items-center gap-2 text-base font-semibold">
                  <Icon className="h-4 w-4 text-muted-foreground" /> {c.who}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.what}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ Ecosystem Vision ═══════════════════ */

function EcosystemVision() {
  return (
    <section id="ecosystem" className="border-b border-border bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead
          eyebrow="Vision"
          title="Building Indonesia's fraud intelligence ecosystem"
          subtitle="SAFER's long-term goal is a collaborative, regulator-supported fraud intelligence network that protects the entire digital financial ecosystem."
          className="reveal"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Globe,
              title: "Shared intelligence",
              body: "Anonymized fraud signals shared across participating institutions — attacks detected once, defended everywhere.",
            },
            {
              icon: Building2,
              title: "Regulator dashboards",
              body: "OJK and BI gain real-time sector-wide fraud visibility without accessing individual customer data.",
            },
            {
              icon: Network,
              title: "Cross-institution graph",
              body: "Mule networks that span multiple banks become visible through federated graph queries.",
            },
            {
              icon: ShieldCheck,
              title: "National fraud baseline",
              body: "Benchmarking fraud rates, typologies and response times across the Indonesian financial sector.",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className={`reveal reveal-delay-${i + 1} rounded-lg border border-border bg-card p-6`}>
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{c.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ CTA ═══════════════════ */

function CTA({ onDemoRequest }: { onDemoRequest: () => void }) {
  return (
    <section className="border-b border-border min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="reveal text-display text-4xl font-semibold tracking-tight md:text-5xl">
          See SAFER work on your transaction patterns.
        </h2>
        <p className="reveal reveal-delay-1 mx-auto mt-4 max-w-2xl text-muted-foreground">
          Explore the live console, simulate fraud scenarios and walk through the fraud graph — no signup required.
        </p>
        <div className="reveal reveal-delay-2 mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/simulator"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Launch Risk Simulator <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={onDemoRequest}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium transition-all hover:bg-accent hover:border-primary/45"
          >
            Hubungi Kami & Request Key
          </button>
          <Link
            to="/network"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-transparent px-5 text-sm font-medium transition-colors hover:bg-accent/10"
          >
            Explore Fraud Graph
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ Footer ═══════════════════ */

function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Logo />
            <p className="mt-3 max-w-md text-xs text-muted-foreground">
              SAFER — Smart AI Fraud & Economic Risk Intelligence. Built for Indonesia&apos;s digital financial ecosystem.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SAFER. Prototype for demonstration purposes.
          </div>
        </div>
        <div className="rounded-lg border border-warning/20 bg-warning/5 p-4 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-warning">Pernyataan Penyangkalan (Disclaimer Industri):</span> Seluruh data transaksi, nama nasabah, nomor rekening, alamat IP, data logikal perangkat, dan visualisasi jaringan hubungan yang disajikan dalam purwarupa (prototype) FDS SAFER ini adalah data sintetis rekayasa buatan. Purwarupa ini dibuat khusus untuk keperluan demonstrasi dan simulasi operasional deteksi fraud industri keuangan digital Indonesia. Tidak menggunakan data nasabah riil atau transaksi finansial nyata dari institusi manapun.
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════ Shared ═══════════════════ */

function SectionHead({ eyebrow, title, subtitle, className = "" }: { eyebrow: string; title: string; subtitle: string; className?: string }) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</div>
      <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">{subtitle}</p>
    </div>
  );
}
