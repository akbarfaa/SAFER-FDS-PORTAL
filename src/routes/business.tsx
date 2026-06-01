import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { Building2, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Business Model · SAFER" },
      { name: "description", content: "Go-to-market, pricing and ecosystem strategy for SAFER fraud intelligence." },
    ],
  }),
  component: BusinessPage,
});

const PHASES = [
  {
    phase: "Phase 1",
    icon: Zap,
    who: "Fintech & E-Wallet",
    items: ["Tier-2 fintech", "Payment gateway providers", "Digital lending", "E-wallet platforms"],
    model: "API-first SaaS · usage-based pricing",
  },
  {
    phase: "Phase 2",
    icon: Building2,
    who: "Regional Banks & BPR",
    items: ["Regional banks", "BPR digital", "Payment processors"],
    model: "Private deployment · annual licensing",
  },
  {
    phase: "Phase 3",
    icon: ShieldCheck,
    who: "Enterprise & Regulators",
    items: ["Tier-1 enterprise banks", "Regulator collaboration", "Consortium intel sharing"],
    model: "Enterprise contracts · ecosystem revenue",
  },
];

const PLANS = [
  {
    name: "Growth",
    price: "Pay-as-you-go",
    desc: "For fintechs scaling fraud defense without upfront investment.",
    features: ["Up to 5M tx / month", "Shared SaaS deployment", "Standard API integration", "Email support · SLA 99.5%"],
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Annual contract",
    desc: "Private VPC, custom models and dedicated investigation tooling.",
    features: ["Unlimited throughput", "Private VPC or on-prem", "Custom ML pipelines", "24/7 named support · SLA 99.95%"],
    highlight: true,
  },
  {
    name: "Consortium",
    price: "Custom",
    desc: "Federated fraud intelligence for banking and regulator alliances.",
    features: ["Cross-tenant intel sharing", "Regulator dashboards", "Compliance co-design", "Joint research & training"],
    highlight: false,
  },
];

function BusinessPage() {
  return (
    <AppShell title="Business Model & Ecosystem" subtitle="Go-to-market · pricing · roadmap">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "Addressable transactions", v: "16 B/yr", d: "Indonesia digital payments" },
          { t: "Estimated fraud losses", v: "Rp 2.7 T", d: "annual industry-wide" },
          { t: "Target customer pool", v: "420+", d: "regulated financial institutions" },
        ].map((c) => (
          <div key={c.t} className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{c.t}</div>
            <div className="num mt-1 text-2xl font-semibold">{c.v}</div>
            <div className="text-xs text-muted-foreground">{c.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4 text-sm font-semibold">Market expansion roadmap</div>
        <div className="grid gap-px bg-border md:grid-cols-3">
          {PHASES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.phase} className="bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">{p.phase}</div>
                <div className="mt-2 flex items-center gap-2 text-base font-semibold">
                  <Icon className="h-4 w-4 text-muted-foreground" /> {p.who}
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {p.items.map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-success" /> {i}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-border pt-3 text-xs">{p.model}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-lg border bg-card p-6 ${p.highlight ? "border-primary ring-1 ring-primary/40" : "border-border"}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{p.name}</div>
              {p.highlight && (
                <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
            </div>
            <div className="num mt-2 text-2xl font-semibold">{p.price}</div>
            <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
            <ul className="mt-4 space-y-2 text-xs">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-success" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-6">
        <div className="text-sm font-semibold">Why localized matters</div>
        <div className="mt-3 grid gap-4 md:grid-cols-3 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Lightweight for fintechs.</span> Global fraud platforms are
            priced and architected for tier-1 banks — most Indonesian fintechs need a faster, cheaper entry point.
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Enterprise depth on demand.</span> SAFER scales from API-only
            usage to private deployments with custom models and dedicated SRE coverage.
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Indonesian compliance fit.</span> Built natively for UU PDP,
            POJK 11 and BI anti-fraud reporting — no costly local adaptation layer required.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4 text-sm font-semibold">Professional Services & Support</div>
        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Custom ML Models", d: "Tailored behavioral models trained on your specific historical fraud patterns and typologies." },
            { t: "Integration Engineering", d: "Dedicated engineers to ensure seamless integration with your core banking or payment gateway." },
            { t: "Analyst Training", d: "On-site or remote workshops to train your fraud ops team on graph intelligence and alert triage." },
            { t: "Compliance Readiness", d: "Consulting to ensure your SAFER deployment meets OJK and BI regulatory requirements." }
          ].map((s) => (
            <div key={s.t} className="bg-card p-5">
              <div className="text-sm font-semibold text-foreground">{s.t}</div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
