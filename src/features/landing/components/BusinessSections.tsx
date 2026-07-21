/**
 * Landing Page — Business & Ecosystem Sections
 * IntegrationFlow, RegulatorySection, BusinessSection, EcosystemVision
 */
import {
  Network, Brain, Lock, Zap, ShieldCheck,
  ArrowRight, Building2, Globe, Layers, Workflow,
} from "lucide-react";
import { SectionHead } from "./SharedComponents";

export function IntegrationFlow() {
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
        <SectionHead eyebrow="Integration" title="Drop-in API integration — production-ready in under two weeks" subtitle="A single REST call returns risk score, explainability, severity and suggested action. Streaming webhooks for real-time monitoring." className="reveal" />
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

export function RegulatorySection() {
  return (
    <section id="compliance" className="border-b border-border bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead eyebrow="Compliance" title="Aligned with OJK, Bank Indonesia and UU PDP" subtitle="Security and governance controls designed for regulated financial institutions, not bolted on after the fact." className="reveal" />
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

export function BusinessSection() {
  return (
    <section id="business" className="border-b border-border min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead eyebrow="Business" title="Built for Indonesia's tiered financial market" subtitle="From tier-2 fintechs to enterprise banks and regulator consortia — SAFER scales pricing and deployment with you." className="reveal" />
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

export function EcosystemVision() {
  return (
    <section id="ecosystem" className="border-b border-border bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead eyebrow="Vision" title="Building Indonesia's fraud intelligence ecosystem" subtitle="SAFER's long-term goal is a collaborative, regulator-supported fraud intelligence network that protects the entire digital financial ecosystem." className="reveal" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Globe, title: "Shared intelligence", body: "Anonymized fraud signals shared across participating institutions — attacks detected once, defended everywhere." },
            { icon: Building2, title: "Regulator dashboards", body: "OJK and BI gain real-time sector-wide fraud visibility without accessing individual customer data." },
            { icon: Network, title: "Cross-institution graph", body: "Mule networks that span multiple banks become visible through federated graph queries." },
            { icon: ShieldCheck, title: "National fraud baseline", body: "Benchmarking fraud rates, typologies and response times across the Indonesian financial sector." },
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
