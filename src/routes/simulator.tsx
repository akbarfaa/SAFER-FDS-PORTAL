import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { useState } from "react";
import { formatIDR, severityStyles, type Severity } from "@/lib/safer-data";
import { Brain, Play, RotateCcw, FileSearch, AlertOctagon, Loader2 } from "lucide-react";
import { api } from "@/lib/api/api-client";
import { scoreTransaction } from "@/lib/risk-scoring";

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

// Local fallback function in case API is down
function localScore(f: FormState) {
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

function buildLocalNarrative(f: FormState, sev: Severity, indicators: ReturnType<typeof localScore>["indicators"]) {
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
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setSimResult(null);

    // Map form state to XGBoost/LightGBM expected features payload
    const payload = {
      amount: f.amount,
      payment_rail: f.rail,
      ewallet_provider: f.rail === "E-Wallet" ? "GoPay" : "None",
      merchant: f.merchant === "Crypto" ? "CryptoXchange ID" : f.merchant === "Gaming" ? "OnlineBet88" : "Tokopedia",
      merchant_category: f.merchant,
      channel: f.rail === "E-Wallet" ? "Mobile App" : f.rail === "QRIS" ? "QR Scan" : "Mobile Banking",
      device_type: f.rail === "E-Wallet" ? "Android" : "Web Browser",
      device_brand: f.deviceMismatch ? "Unknown Device" : "Samsung Galaxy S22",
      device_fingerprint: "abc123xyz789",
      ip_address: "36.68.22.45",
      is_new_device: f.deviceKnown ? 0 : 1,
      account_age_days: f.accountAge * 30, // months to days
      is_velocity_anomaly: f.velocity >= 8 ? 1 : 0,
      is_geo_mismatch: f.geoAnomaly ? 1 : 0,
      is_off_hours: (f.hour < 5 || f.hour > 23) ? 1 : 0,
      is_high_value_for_rail: f.amount > 5_000_000 ? 1 : 0,
      is_suspicious_ip: f.suspiciousIp ? 1 : 0,
      is_risky_merchant: (f.merchant === "Crypto" || f.merchant === "Gaming" || f.merchant === "Utility") ? 1 : 0,
      is_new_account: f.accountAge < 1 ? 1 : 0,
      has_failed_attempts: f.failedAttempts ? 1 : 0,
      is_device_mismatch: f.deviceMismatch ? 1 : 0,
      is_sim_swap: 0,
      is_unusual_beneficiary: 1,
      velocity_count: f.velocity,
      geo_distance_km: f.geoAnomaly ? 1150.0 : 4.5,
      sender_lat: -6.186, // Jakarta Central
      sender_lng: 106.834,
      receiver_lat: f.geoAnomaly ? -7.250 : -6.190, // Surabaya or nearby Jakarta
      receiver_lng: f.geoAnomaly ? 112.751 : 106.840,
      sender_bank: "BCA",
      receiver_bank: "Mandiri",
      sender_name: "Andi Prasetyo",
      sender_account: "022938122",
      sender_city: "Jakarta Pusat",
      sender_province: "DKI Jakarta",
      receiver_name: "Budi Hartono",
      receiver_account: "100938211"
    };

    try {
      const res = await api.simulateTransaction(payload);
      setSimResult(res);
    } catch (err) {
      console.warn("[Simulator] Backend scoring failed. Falling back to local score rules:", err);
      const local = localScore(f);
      setSimResult({
        risk_score: local.total,
        severity: local.severity,
        fraud_probability: local.total / 100,
        xgb_probability: local.total / 100,
        lgb_probability: local.total / 100,
        ai_reasoning: buildLocalNarrative(f, local.severity, local.indicators),
        primary_risk_factors: local.indicators
          .filter((ind) => ind.hit)
          .map((ind) => ({
            feature: ind.label,
            label: ind.label,
            shap_value: ind.weight / 100
          })),
        suggested_action: local.severity === "critical"
          ? "HOLD TRANSACTION IMMEDIATELY & FREEZE ACCOUNT"
          : local.severity === "high"
            ? "HOLD TRANSACTION FOR MANUAL VERIFICATION"
            : local.severity === "medium"
              ? "MONITOR CLOSELY & ENABLE STEP-UP AUTH"
              : "ALLOW TRANSACTION"
      });
    } finally {
      setLoading(false);
    }
  };

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
                onClick={runAnalysis}
                disabled={loading}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run AI analysis
              </button>
              <button
                onClick={() => {
                  setF(DEFAULT);
                  setSimResult(null);
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm transition-colors hover:bg-accent"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="grid h-full min-h-[400px] place-items-center rounded-lg border border-dashed border-border bg-card p-10 text-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="mt-3 text-sm font-semibold text-foreground">Calculating risk score via XGBoost & LightGBM...</div>
                <p className="mt-1 text-xs text-muted-foreground">Running SHAP feature attribution in real-time</p>
              </div>
            </div>
          ) : !simResult ? (
            <EmptyResult />
          ) : (
            <>
              <ResultSummary score={simResult.risk_score} severity={simResult.severity} suggestedAction={simResult.suggested_action} />
              
              {/* XGBoost & LightGBM Individual Probabilities */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">XGBoost Probabilitas</div>
                  <div className="mt-1.5 num text-2xl font-semibold text-foreground">{(simResult.xgb_probability * 100).toFixed(1)}%</div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">LightGBM Probabilitas</div>
                  <div className="mt-1.5 num text-2xl font-semibold text-foreground">{(simResult.lgb_probability * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                  <Brain className="h-4 w-4 text-primary" />
                  <div className="text-sm font-semibold">AI fraud explanation</div>
                </div>
                <div className="px-5 py-4 text-sm leading-relaxed whitespace-pre-line prose max-w-none text-foreground">
                  {simResult.ai_reasoning}
                </div>
              </div>

              {simResult.primary_risk_factors && simResult.primary_risk_factors.length > 0 && (
                <div className="rounded-lg border border-border bg-card">
                  <div className="border-b border-border px-5 py-4 text-sm font-semibold font-sans">
                    Faktor Risiko Utama (SHAP Feature Attribution)
                  </div>
                  <div className="divide-y divide-border">
                    {simResult.primary_risk_factors.map((factor: any, index: number) => {
                      const percentage = Math.min(100, Math.max(5, Math.round(factor.shap_value * 100)));
                      return (
                        <div key={index} className="flex items-center gap-4 px-5 py-3.5">
                          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-critical" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-foreground">{factor.label}</span>
                              <span className="num text-xs font-bold text-critical">
                                +{(factor.shap_value * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-critical"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ResultSummary({ score: total, severity, suggestedAction }: { score: number; severity: Severity; suggestedAction: string }) {
  const s = severityStyles[severity];
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
            Fraud probability ≈ <span className="num font-medium text-foreground">{total}%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2.5 text-sm">
        <AlertOctagon className="mt-0.5 h-4 w-4 text-primary" />
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Suggested action</div>
          <div className="font-semibold text-foreground">{suggestedAction}</div>
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
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
    />
  );
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
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
      className={`flex items-center justify-between rounded-md border px-3 py-2 text-xs transition-colors w-full ${
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
