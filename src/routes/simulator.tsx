/**
 * Risk Simulator Route — Thin Orchestrator
 * Composes simulator components from @/features/simulator.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { useState } from "react";
import { api } from "@/lib/api/api-client";
import {
  SimulatorForm,
  SimulatorResults,
  DEFAULT_FORM_STATE,
  localScore,
  buildLocalNarrative,
  type FormState,
} from "@/features/simulator";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Risk Simulator · SAFER" },
      { name: "description", content: "Simulate transactions and get explainable AI fraud risk scoring." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SimulatorPage,
});

function SimulatorPage() {
  const [f, setF] = useState<FormState>(DEFAULT_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setSimResult(null);

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
      account_age_days: f.accountAge * 30,
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
      sender_lat: -6.186,
      sender_lng: 106.834,
      receiver_lat: f.geoAnomaly ? -7.250 : -6.190,
      receiver_lng: f.geoAnomaly ? 112.751 : 106.840,
      sender_bank: "BCA",
      receiver_bank: "Mandiri",
      sender_name: "Andi Prasetyo",
      sender_account: "022938122",
      sender_city: "Jakarta Pusat",
      sender_province: "DKI Jakarta",
      receiver_name: "Budi Hartono",
      receiver_account: "100938211",
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
            shap_value: ind.weight / 100,
          })),
        suggested_action: local.severity === "critical"
          ? "HOLD TRANSACTION IMMEDIATELY & FREEZE ACCOUNT"
          : local.severity === "high"
            ? "HOLD TRANSACTION FOR MANUAL VERIFICATION"
            : local.severity === "medium"
              ? "MONITOR CLOSELY & ENABLE STEP-UP AUTH"
              : "ALLOW TRANSACTION",
      });
    } finally {
      setLoading(false);
    }
  };

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <AppShell title="Risk Simulator" subtitle="Explainable AI fraud scoring">
      <div className="grid gap-4 lg:grid-cols-5">
        <SimulatorForm
          formState={f}
          loading={loading}
          onUpdate={update}
          onRunAnalysis={runAnalysis}
          onReset={() => {
            setF(DEFAULT_FORM_STATE);
            setSimResult(null);
          }}
        />

        <div className="lg:col-span-3 space-y-4">
          <SimulatorResults loading={loading} simResult={simResult} />
        </div>
      </div>
    </AppShell>
  );
}
