/**
 * Landing Page — Platform Sections
 * ProblemSection, CapabilitiesSection, DashboardPreview, PremiumDashboardMockup
 */
import { Link } from "@tanstack/react-router";
import {
  Activity, Network, Brain, Lock, Zap, GitBranch,
  ArrowRight, CheckCircle2, AlertTriangle, TrendingUp, ShieldCheck,
} from "lucide-react";
import { SectionHead } from "./SharedComponents";

export function ProblemSection() {
  return (
    <section className="border-b border-border bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead eyebrow="The Problem" title="Rule-based fraud systems can't keep up with Indonesia's transaction velocity" subtitle="Static rules generate noise, miss new patterns, and force analysts into reactive investigation. Modern fraud is adaptive — defense needs to be too." className="reveal" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: AlertTriangle, title: "High false positives", body: "Legacy rule engines flag 30–60% legitimate traffic, eroding customer trust and overwhelming ops teams." },
            { icon: Activity, title: "Blind to coordinated attacks", body: "Mule networks, device farms and QRIS abuse stay invisible without behavioral graph context." },
            { icon: GitBranch, title: "Long investigation cycles", body: "Manual triage across siloed logs delays decisions and increases recovery cost per incident." },
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

export function CapabilitiesSection() {
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
        <SectionHead eyebrow="Platform" title="A complete fraud intelligence stack — not a black box" subtitle="SAFER combines deterministic risk scoring, ML behavioral models and graph analytics into one operational platform." className="reveal" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className={`reveal reveal-delay-${(i % 3) + 1} group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40`}>
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

export function DashboardPreview() {
  return (
    <section id="preview" className="border-b border-border bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead eyebrow="Operational Console" title="Built for fraud analysts, not for dashboards" subtitle="Triage queues, investigation timelines and graph drilldowns designed around how SOC and fraud ops teams actually work." className="reveal" />
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
            <Link to="/dashboard" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
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
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/40" />
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
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
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
              <div key={a.id} className="flex items-center justify-between rounded border border-border bg-surface px-2.5 py-1.5 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${a.sev === "critical" ? "bg-critical" : a.sev === "high" ? "bg-destructive" : "bg-warning"}`} />
                  <span className="font-mono text-[9px] text-muted-foreground flex-shrink-0">{a.id}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{a.reason}</span>
                </div>
                <span className="num text-[10px] text-muted-foreground pl-1 flex-shrink-0">{a.amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card p-4 flex flex-col justify-between">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Risk trend (14d)</div>
            <div className="text-[10px] text-primary font-semibold">Peak: 84%</div>
          </div>
          <div className="relative h-20 w-full mt-1">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="10" x2="100" y2="10" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              <path d="M 0 35 Q 10 25, 20 28 T 40 15 T 60 20 T 80 10 T 100 5 L 100 40 L 0 40 Z" fill="url(#chartGradient)" />
              <path d="M 0 35 Q 10 25, 20 28 T 40 15 T 60 20 T 80 10 T 100 5" fill="none" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="80" cy="10" r="1.5" fill="var(--primary)" className="animate-pulse" />
            </svg>
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>05 Jul</span><span>09 Jul</span><span>13 Jul</span><span>17 Jul</span>
          </div>
        </div>
      </div>
    </div>
  );
}
