/**
 * Risk Simulator — Types & Offline Scorer Fallback
 */
import { formatIDR, type Severity } from "@/lib/safer-data";

export interface FormState {
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

export const DEFAULT_FORM_STATE: FormState = {
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

export function localScore(f: FormState) {
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

export function buildLocalNarrative(f: FormState, sev: Severity, indicators: ReturnType<typeof localScore>["indicators"]) {
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
