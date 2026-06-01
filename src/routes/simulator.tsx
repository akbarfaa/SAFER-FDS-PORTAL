import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { useMemo, useState } from "react";
import { formatIDR, severityStyles, type Severity } from "@/lib/safer-data";
import { Brain, Play, RotateCcw, FileSearch, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Risk Simulator · SAFER" },
      { name: "description", content: "Simulate transactions and get explainable AI fraud risk scoring." },
    ],
  }),
  component: SimulatorPage,
});

interface FormState {
  amount: number;
  frequency: number;
  hour: number;
  deviceKnown: boolean;
  geoAnomaly: boolean;
  merchant: string;
  rail: string;
  accountAge: number;
  suspiciousIp: boolean;
  velocity: number;
  deviceMismatch: boolean;
  failedAttempts: boolean;
}

const DEFAULT: FormState = {
  amount: 2_500_000,
  frequency: 4,
  hour: 14,
  deviceKnown: true,
  geoAnomaly: false,
  merchant: "Retail",
  rail: "QRIS",
  accountAge: 18,
  suspiciousIp: false,
  velocity: 3,
  deviceMismatch: false,
  failedAttempts: false,
};

function score(f: FormState) {
  const indicators: { label: string; weight: number; hit: boolean; detail: string }[] = [];
  const push = (label: string, weight: number, hit: boolean, detail: string) =>
    indicators.push({ label, weight, hit, detail });

  push("Transaction amount", Math.min(25, Math.round((f.amount / 50_000_000) * 25)), f.amount > 10_000_000,
    f.amount > 10_000_000 ? `High-value transfer of ${formatIDR(f.amount)}` : `Within typical range`);
  push("Transaction velocity", Math.min(15, f.velocity * 2), f.velocity >= 6,
    f.velocity >= 6 ? `${f.velocity} tx in short window — burst pattern` : `Velocity nominal`);
  push("Off-hours timing", 10, f.hour < 5 || f.hour > 23,
    f.hour < 5 || f.hour > 23 ? `Transaction at ${f.hour}:00 — unusual hour` : `Standard hours`);
  push("Device trust", 14, !f.deviceKnown || f.deviceMismatch,
    !f.deviceKnown ? `New device fingerprint` : f.deviceMismatch ? `Device mismatch vs prior session` : `Trusted device`);
  push("Geolocation anomaly", 12, f.geoAnomaly,
    f.geoAnomaly ? `Geo distance inconsistent with prior tx` : `Location consistent`);
  push("Suspicious network", 10, f.suspiciousIp,
    f.suspiciousIp ? `IP matched against threat intelligence feed` : `Network clean`);
  push("Account maturity", 8, f.accountAge < 3,
    f.accountAge < 3 ? `Account opened ${f.accountAge} months ago — low maturity` : `Established account`);
  push("Failed auth attempts", 8, f.failedAttempts,
    f.failedAttempts ? `Repeated failed transactions detected` : `No prior failures`);
  push("Merchant risk class", 6, f.merchant === "Crypto" || f.merchant === "Gaming",
    f.merchant === "Crypto" || f.merchant === "Gaming"
      ? `${f.merchant} merchant category flagged as elevated risk`
      : `${f.merchant} category nominal`);
  push("Rail behavior", 5, f.rail === "BI-FAST" && f.amount > 20_000_000,
    f.rail === "BI-FAST" && f.amount > 20_000_000
      ? `Large BI-FAST transfer — common mule pattern`
      : `Rail use consistent`);

  let raw = 0;
  for (const i of indicators) if (i.hit) raw += i.weight;
  const total = Math.min(100, raw);
  const severity: Severity = total >= 80 ? "critical" : total >= 60 ? "high" : total >= 35 ? "medium" : "low";
  return { total, severity, indicators };
}

function buildNarrative(f: FormState, sev: Severity, indicators: ReturnType<typeof score>["indicators"]) {
  const hits = indicators.filter((i) => i.hit);
  if (hits.length === 0)
    return "Transaction profile is consistent with the customer's historical behavior. No material risk indicators were triggered. Recommended action: allow and continue passive monitoring.";

  const reasons = hits
    .slice(0, 3)
    .map((h) => h.detail.toLowerCase())
    .join("; ");
  const tail = {
    low: "Risk is contained but logged for trend analysis.",
    medium: "Recommend silent enrichment and step-up authentication on the next transaction.",
    high: "Recommend immediate analyst review and customer outreach before fund release.",
    critical: "Recommend automatic hold, account session termination and escalation to fraud operations.",
  }[sev];
  return `Transaction pattern indicates ${reasons}. Combined behavioral signal increases probability of ${
    f.deviceMismatch || !f.deviceKnown ? "account takeover" : "mule account activity"
  }. ${tail}`;
}

function SimulatorPage() {
  const [f, setF] = useState<FormState>(DEFAULT);
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const result = useMemo(() => (submitted ? score(submitted) : null), [submitted]);
  const narrative = useMemo(
    () => (submitted && result ? buildNarrative(submitted, result.severity, result.indicators) : ""),
    [submitted, result],
  );

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <AppShell title="Risk Simulator" subtitle="Explainable AI fraud scoring">
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <div className="text-sm font-semibold">Transaction parameters</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Adjust values to simulate a real-world transaction
            </div>
          </div>
          <div className="space-y-4 p-5">
            <Field label={`Amount: ${formatIDR(f.amount)}`}>
              <input
                type="range"
                min={50_000}
                max={50_000_000}
                step={50_000}
                value={f.amount}
                onChange={(e) => update("amount", Number(e.target.value))}
                className="w-full accent-primary"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hour of day">
                <NumberInput value={f.hour} min={0} max={23} onChange={(v) => update("hour", v)} />
              </Field>
              <Field label="Account age (months)">
                <NumberInput value={f.accountAge} min={0} max={120} onChange={(v) => update("accountAge", v)} />
              </Field>
              <Field label="Frequency (tx/day)">
                <NumberInput value={f.frequency} min={0} max={50} onChange={(v) => update("frequency", v)} />
              </Field>
              <Field label="Velocity (tx / 10 min)">
                <NumberInput value={f.velocity} min={0} max={20} onChange={(v) => update("velocity", v)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Merchant category">
                <Select value={f.merchant} onChange={(v) => update("merchant", v)}
                  options={["Retail", "Food", "Travel", "Crypto", "Gaming", "Utility"]} />
              </Field>
              <Field label="Payment rail">
                <Select value={f.rail} onChange={(v) => update("rail", v)}
                  options={["QRIS", "BI-FAST", "E-Wallet", "Card", "Virtual Acc"]} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Toggle label="Device known" value={f.deviceKnown} onChange={(v) => update("deviceKnown", v)} />
              <Toggle label="Device mismatch" value={f.deviceMismatch} onChange={(v) => update("deviceMismatch", v)} />
              <Toggle label="Geo anomaly" value={f.geoAnomaly} onChange={(v) => update("geoAnomaly", v)} />
              <Toggle label="Suspicious IP" value={f.suspiciousIp} onChange={(v) => update("suspiciousIp", v)} />
              <Toggle label="Failed attempts" value={f.failedAttempts} onChange={(v) => update("failedAttempts", v)} />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSubmitted({ ...f })}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Play className="h-4 w-4" /> Run AI analysis
              </button>
              <button
                onClick={() => {
                  setF(DEFAULT);
                  setSubmitted(null);
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm transition-colors hover:bg-accent"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {!result ? (
            <EmptyResult />
          ) : (
            <>
              <ResultSummary score={result.total} severity={result.severity} />
              <div className="rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                  <Brain className="h-4 w-4 text-primary" />
                  <div className="text-sm font-semibold">AI fraud explanation</div>
                </div>
                <p className="px-5 py-4 text-sm leading-relaxed">{narrative}</p>
              </div>
              <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border px-5 py-4 text-sm font-semibold">Indicator breakdown</div>
                <div className="divide-y divide-border">
                  {result.indicators.map((ind) => (
                    <div key={ind.label} className="flex items-center gap-4 px-5 py-3">
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          ind.hit ? "bg-destructive" : "bg-success/60"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{ind.label}</span>
                          <span className="num text-xs text-muted-foreground">
                            {ind.hit ? `+${ind.weight}` : "0"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{ind.detail}</div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full ${ind.hit ? "bg-destructive" : "bg-muted-foreground/30"}`}
                            style={{ width: `${(ind.weight / 25) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ResultSummary({ score: total, severity }: { score: number; severity: Severity }) {
  const s = severityStyles[severity];
  const action =
    severity === "critical"
      ? "Auto-block & escalate to fraud operations"
      : severity === "high"
        ? "Hold for analyst review · contact customer"
        : severity === "medium"
          ? "Step-up authentication on next transaction"
          : "Allow & continue passive monitoring";
  return (
    <div className={`rounded-lg border ${s.ring} bg-card p-5 ring-1`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">AI Risk Score</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="num text-5xl font-semibold tracking-tight">{total}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Severity</div>
          <div className={`mt-1 inline-flex items-center gap-2 rounded-md ${s.bg} px-2.5 py-1 text-sm font-medium ${s.text}`}>
            <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Fraud probability ≈ <span className="num font-medium text-foreground">{Math.min(99, total + 4)}%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2.5 text-sm">
        <AlertOctagon className="mt-0.5 h-4 w-4 text-primary" />
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Suggested action</div>
          <div>{action}</div>
        </div>
      </div>
    </div>
  );
}

function EmptyResult() {
  return (
    <div className="grid h-full min-h-[400px] place-items-center rounded-lg border border-dashed border-border bg-card p-10 text-center">
      <div>
        <FileSearch className="mx-auto h-8 w-8 text-muted-foreground" />
        <div className="mt-3 text-sm font-semibold">Run AI analysis to see results</div>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          Configure transaction parameters on the left, then run the analysis to get an explainable AI risk score,
          weighted indicators and a suggested investigator action.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function NumberInput({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between rounded-md border px-3 py-2 text-xs transition-colors ${
        value ? "border-primary/40 bg-primary/10 text-foreground" : "border-border bg-surface text-muted-foreground"
      }`}
    >
      <span>{label}</span>
      <span
        className={`relative h-4 w-7 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted-foreground/30"}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-card transition-all ${value ? "left-3.5" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}
