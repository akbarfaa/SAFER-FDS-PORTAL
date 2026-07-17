import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { Lock, ShieldCheck, FileText, KeyRound, EyeOff, Users, GitBranch, Server } from "lucide-react";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance, Security & UU PDP Governance · SAFER" },
      {
        name: "description",
        content:
          "Compliance-by-design controls aligned with Indonesia's UU PDP Nomor 27 Tahun 2022, OJK POJK 11 IT risk requirements, and Bank Indonesia anti-fraud directives. Featuring PII anonymization, mTLS, and encrypted audit trails.",
      },
      {
        name: "keywords",
        content:
          "kepatuhan uu pdp, pojk 11 ojk, pelindungan data pribadi perbankan, enkripsi data perbankan, anti-fraud reporting bank indonesia, mtls api security, data residency indonesia",
      },
    ],
  }),
  component: CompliancePage,
});

const CONTROLS = [
  { icon: Lock, t: "AES-256 encryption", d: "All data at rest and in transit encrypted with managed KMS rotation." },
  { icon: KeyRound, t: "Role-based access (RBAC)", d: "Granular roles for analyst, supervisor, auditor and admin with separation of duties." },
  { icon: FileText, t: "Immutable audit logs", d: "Tamper-evident logging of every model decision and analyst action." },
  { icon: EyeOff, t: "Anonymized inference", d: "PII tokenized before reaching scoring models — only required signals propagate." },
  { icon: Server, t: "API security", d: "mTLS, signed payloads, replay protection and per-tenant rate limits." },
  { icon: Users, t: "Explainable AI governance", d: "Every score returns feature weights and natural-language rationale." },
  { icon: GitBranch, t: "Compliance-by-design", d: "DPIA workflows, retention controls and data residency built into the platform." },
  { icon: ShieldCheck, t: "Incident response", d: "Documented runbooks with regulator-ready incident reports in under 4 hours." },
];

const MATURITY = [
  { area: "Data protection (UU PDP)", level: 92 },
  { area: "OJK POJK 11 IT risk", level: 88 },
  { area: "BI anti-fraud reporting", level: 84 },
  { area: "ISO 27001 controls", level: 90 },
  { area: "Model governance", level: 86 },
];

function CompliancePage() {
  return (
    <AppShell title="Compliance & Security Center" subtitle="Governance · audit · controls">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "Active controls", v: "47", d: "across 8 control families" },
          { t: "Last external audit", v: "12 wks", d: "no critical findings" },
          { t: "Mean time to report", v: "3.2 h", d: "regulator-ready packets" },
        ].map((k) => (
          <div key={k.t} className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{k.t}</div>
            <div className="num mt-1 text-2xl font-semibold">{k.v}</div>
            <div className="text-xs text-muted-foreground">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4 text-sm font-semibold">Operational controls</div>
          <div className="grid gap-px bg-border md:grid-cols-2">
            {CONTROLS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.t} className="bg-card p-5">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-semibold">{c.t}</div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.d}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4 text-sm font-semibold">Maturity indicators</div>
          <div className="space-y-4 p-5">
            {MATURITY.map((m) => (
              <div key={m.area}>
                <div className="flex items-center justify-between text-xs">
                  <span>{m.area}</span>
                  <span className="num text-muted-foreground">{m.level}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${m.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4 text-sm font-semibold">Fraud investigation workflow</div>
          <div className="flex flex-col">
            {[
              { n: 1, t: "Detect", d: "AI scoring + rule overlays" },
              { n: 2, t: "Triage", d: "Analyst queue by severity" },
              { n: 3, t: "Investigate", d: "Graph drilldown & evidence" },
              { n: 4, t: "Decide", d: "Hold · refund · escalate" },
              { n: 5, t: "Report", d: "Regulator packet generated" },
            ].map((s) => (
              <div key={s.n} className="flex gap-4 p-4 border-b border-border last:border-0">
                <div className="flex-shrink-0 grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {s.n}
                </div>
                <div>
                  <div className="text-sm font-semibold">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card flex flex-col">
          <div className="border-b border-border px-5 py-4 text-sm font-semibold">Security Infrastructure</div>
          <div className="flex-1 p-5 bg-surface/50 overflow-hidden relative min-h-[300px]">
            <svg viewBox="0 0 500 400" className="w-full h-full">
              <defs>
                <marker id="arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              
              {/* Outer boundary */}
              <rect x="20" y="20" width="460" height="360" rx="8" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 6" />
              <text x="250" y="45" textAnchor="middle" fontSize="12" fill="var(--muted-foreground)" fontWeight="600">SECURE VPC ENCLAVE</text>

              {/* Data Ingestion */}
              <rect x="50" y="80" width="120" height="60" rx="6" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
              <text x="110" y="110" textAnchor="middle" fontSize="12" fill="var(--foreground)" fontWeight="500">API Gateway</text>
              <text x="110" y="125" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">mTLS / Rate Limit</text>

              {/* Tokenization */}
              <rect x="250" y="80" width="120" height="60" rx="6" fill="var(--card)" stroke="var(--warning)" strokeWidth="2" />
              <text x="310" y="110" textAnchor="middle" fontSize="12" fill="var(--warning)" fontWeight="500">Tokenization</text>
              <text x="310" y="125" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">PII Anonymizer</text>

              {/* AI Engine */}
              <rect x="250" y="180" width="120" height="60" rx="6" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
              <text x="310" y="210" textAnchor="middle" fontSize="12" fill="var(--foreground)" fontWeight="500">Scoring Engine</text>
              <text x="310" y="225" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">Anonymized Data</text>

              {/* Audit DB */}
              <rect x="150" y="280" width="200" height="60" rx="6" fill="var(--card)" stroke="var(--success)" strokeWidth="2" />
              <text x="250" y="310" textAnchor="middle" fontSize="12" fill="var(--success)" fontWeight="500">Immutable Audit Log</text>
              <text x="250" y="325" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">Encrypted Data at Rest</text>

              {/* Connections */}
              <line x1="170" y1="110" x2="240" y2="110" stroke="var(--muted-foreground)" strokeWidth="2" markerEnd="url(#arrow-sec)" />
              <line x1="310" y1="140" x2="310" y2="170" stroke="var(--muted-foreground)" strokeWidth="2" markerEnd="url(#arrow-sec)" />
              
              {/* Audit Logging connections */}
              <line x1="110" y1="140" x2="110" y2="310" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="110" y1="310" x2="140" y2="310" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-sec)" />
              
              <line x1="310" y1="240" x2="310" y2="280" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-sec)" />

            </svg>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
