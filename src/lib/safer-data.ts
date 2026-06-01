// Deterministic mock data generators for SAFER demo
export type Severity = "low" | "medium" | "high" | "critical";

export const severityStyles: Record<Severity, { label: string; bg: string; text: string; ring: string; dot: string }> = {
  low: { label: "Low", bg: "bg-success/10", text: "text-success", ring: "ring-success/30", dot: "bg-success" },
  medium: { label: "Medium", bg: "bg-warning/15", text: "text-warning", ring: "ring-warning/30", dot: "bg-warning" },
  high: { label: "High", bg: "bg-destructive/10", text: "text-destructive", ring: "ring-destructive/30", dot: "bg-destructive" },
  critical: { label: "Critical", bg: "bg-critical/15", text: "text-critical", ring: "ring-critical/40", dot: "bg-critical" },
};

const NAMES = ["Andi P.", "Sari D.", "Budi H.", "Maya K.", "Rizki A.", "Dewi L.", "Faisal R.", "Putri N.", "Aldo S.", "Indah W."];
const MERCH = ["Tokopedia", "Shopee", "GoFood", "Grab", "Alfamart", "Blibli", "Lazada", "Pertamina", "ATM Mandiri", "QRIS Merchant"];
const RAIL = ["QRIS", "BI-FAST", "E-Wallet", "Virtual Acc", "Card", "Transfer"];
const CITIES = ["Jakarta", "Surabaya", "Bandung", "Medan", "Denpasar", "Makassar", "Semarang"];

function pick<T>(arr: readonly T[], i: number) {
  return arr[i % arr.length];
}

export interface Tx {
  id: string;
  time: string;
  customer: string;
  merchant: string;
  rail: string;
  city: string;
  amount: number;
  score: number;
  severity: Severity;
  status: "Allowed" | "Flagged" | "Blocked" | "Review";
}

export function generateTransactions(n = 14): Tx[] {
  const now = Date.now();
  return Array.from({ length: n }).map((_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    const amount = Math.round(50_000 + r * 48_000_000);
    const score = Math.round(((i * 37 + seed) % 100));
    const severity: Severity = score > 85 ? "critical" : score > 65 ? "high" : score > 40 ? "medium" : "low";
    const status =
      severity === "critical" ? "Blocked" : severity === "high" ? "Review" : severity === "medium" ? "Flagged" : "Allowed";
    const d = new Date(now - i * 1000 * 60 * 3);
    return {
      id: `TX-${(99000 + i).toString()}`,
      time: d.toTimeString().slice(0, 5),
      customer: pick(NAMES, i),
      merchant: pick(MERCH, i + 3),
      rail: pick(RAIL, i + 1),
      city: pick(CITIES, i + 2),
      amount,
      score,
      severity,
      status,
    };
  });
}

export function formatIDR(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export const trendData = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  flagged: 40 + Math.round(Math.sin(i / 2) * 18 + i * 1.4 + (i % 3) * 6),
  blocked: 14 + Math.round(Math.cos(i / 3) * 8 + i * 0.6),
  reviewed: 22 + Math.round(Math.sin(i / 4) * 10 + (i % 4) * 3),
}));

export const railData = [
  { rail: "QRIS", value: 38 },
  { rail: "BI-FAST", value: 27 },
  { rail: "E-Wallet", value: 19 },
  { rail: "Card", value: 11 },
  { rail: "VA", value: 5 },
];

export const riskMix = [
  { name: "Low", value: 62, color: "var(--success)" },
  { name: "Medium", value: 22, color: "var(--warning)" },
  { name: "High", value: 11, color: "var(--destructive)" },
  { name: "Critical", value: 5, color: "var(--critical)" },
];
