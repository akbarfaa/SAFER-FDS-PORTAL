import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { Cloud, Database, Cpu, Lock, Network, Layers } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture · SAFER" },
      { name: "description", content: "System architecture and technology stack of the SAFER fraud intelligence platform." },
    ],
  }),
  component: ArchPage,
});

const LAYERS = [
  {
    icon: Layers,
    t: "Frontend & Console",
    d: "Analyst console, investigator workspace and admin policy editor.",
    tech: ["React 19", "Next.js / TanStack Start", "Tailwind CSS", "Recharts"],
  },
  {
    icon: Network,
    t: "API Gateway",
    d: "Authentication, mTLS termination, per-tenant rate limiting and signed payload validation.",
    tech: ["Kong / Envoy", "OAuth 2.1", "mTLS"],
  },
  {
    icon: Cpu,
    t: "AI Analysis Engine",
    d: "Real-time scoring service combining deterministic rules and ML behavioral models.",
    tech: ["FastAPI", "Python 3.12", "Scikit-learn", "PyTorch"],
  },
  {
    icon: Database,
    t: "Graph Intelligence",
    d: "Fraud network store mapping accounts, devices, merchants and shared identifiers.",
    tech: ["Neo4j", "Apache AGE", "Redis"],
  },
  {
    icon: Cloud,
    t: "Monitoring & Streaming",
    d: "Event ingestion, real-time aggregation and alert routing.",
    tech: ["Kafka", "Prometheus", "OpenTelemetry"],
  },
  {
    icon: Lock,
    t: "Compliance Layer",
    d: "Audit logging, RBAC, tokenization vault and regulator reporting pipelines.",
    tech: ["Vault", "Postgres", "S3 (WORM)", "Docker"],
  },
];

function ArchPage() {
  return (
    <AppShell title="Architecture & Technology" subtitle="Reference deployment topology">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-sm font-semibold">System topology</div>
        <p className="mt-1 text-xs text-muted-foreground mb-6">
          SAFER runs as a horizontally scalable microservice stack on Kubernetes, deployable as managed SaaS, private
          VPC or on-premise.
        </p>
        
        {/* Visual SVG Diagram */}
        <div className="w-full overflow-x-auto bg-surface/50 rounded-lg border border-border p-4">
          <div className="min-w-[700px] h-[360px] relative">
            <svg viewBox="0 0 800 360" className="w-full h-full">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
                </marker>
                <marker id="arrow-primary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--primary)" />
                </marker>
              </defs>

              {/* Client Layer */}
              <g transform="translate(40, 160)">
                <rect x="0" y="0" width="120" height="40" rx="6" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
                <text x="60" y="24" textAnchor="middle" fontSize="12" fill="var(--foreground)" fontWeight="500">Client Apps</text>
              </g>

              {/* API Gateway */}
              <g transform="translate(220, 160)">
                <rect x="0" y="-40" width="100" height="120" rx="6" fill="var(--card)" stroke="var(--chart-2)" strokeWidth="2" strokeDasharray="4 4" />
                <text x="50" y="24" textAnchor="middle" fontSize="12" fill="var(--chart-2)" fontWeight="600">API Gateway</text>
              </g>

              {/* Core Engine Layer */}
              <g transform="translate(400, 60)">
                <rect x="0" y="0" width="200" height="240" rx="8" fill="var(--primary)" opacity="0.05" />
                <rect x="0" y="0" width="200" height="240" rx="8" fill="none" stroke="var(--primary)" strokeWidth="2" />
                <text x="100" y="25" textAnchor="middle" fontSize="11" fill="var(--primary)" fontWeight="600" letterSpacing="0.1em">CORE ENGINE</text>
                
                <rect x="25" y="45" width="150" height="40" rx="6" fill="var(--card)" stroke="var(--primary)" strokeWidth="1" />
                <text x="100" y="69" textAnchor="middle" fontSize="12" fill="var(--foreground)">AI Scoring</text>
                
                <rect x="25" y="100" width="150" height="40" rx="6" fill="var(--card)" stroke="var(--primary)" strokeWidth="1" />
                <text x="100" y="124" textAnchor="middle" fontSize="12" fill="var(--foreground)">Graph Intel</text>

                <rect x="25" y="155" width="150" height="40" rx="6" fill="var(--card)" stroke="var(--primary)" strokeWidth="1" />
                <text x="100" y="179" textAnchor="middle" fontSize="12" fill="var(--foreground)">Streaming Bus</text>
              </g>

              {/* Data & Compliance */}
              <g transform="translate(660, 60)">
                <rect x="0" y="0" width="100" height="240" rx="6" fill="var(--card)" stroke="var(--chart-3)" strokeWidth="2" />
                <text x="50" y="125" textAnchor="middle" fontSize="12" fill="var(--chart-3)" fontWeight="600" transform="rotate(-90 50 125)">Data & Compliance</text>
              </g>

              {/* Connections */}
              <line x1="160" y1="180" x2="210" y2="180" stroke="var(--muted-foreground)" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="320" y1="180" x2="390" y2="180" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#arrow-primary)" />
              <line x1="600" y1="180" x2="650" y2="180" stroke="var(--muted-foreground)" strokeWidth="2" markerEnd="url(#arrow)" />
              
              <line x1="600" y1="120" x2="650" y2="120" stroke="var(--muted-foreground)" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="600" y1="240" x2="650" y2="240" stroke="var(--muted-foreground)" strokeWidth="2" markerEnd="url(#arrow)" />

              {/* Infra wrap */}
              <rect x="20" y="30" width="760" height="300" rx="12" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="8 8" />
              <text x="400" y="320" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)" letterSpacing="0.1em">KUBERNETES INFRASTRUCTURE</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LAYERS.map((l) => {
          const Icon = l.icon;
          return (
            <div key={l.t} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold">{l.t}</div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{l.d}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {l.tech.map((t) => (
                  <span key={t} className="rounded bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { t: "Latency", v: "<120ms", d: "p95 scoring latency at 5k tx/sec" },
          { t: "Throughput", v: "50k tx/s", d: "horizontal scale per region" },
          { t: "Availability", v: "99.95%", d: "multi-AZ active/active topology" },
        ].map((c) => (
          <div key={c.t} className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{c.t}</div>
            <div className="num mt-1 text-2xl font-semibold">{c.v}</div>
            <div className="text-xs text-muted-foreground">{c.d}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
