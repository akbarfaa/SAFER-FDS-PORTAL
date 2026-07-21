/**
 * SAFER — Deterministic Risk Scoring Engine
 *
 * Evaluates a raw transaction against 15+ weighted fraud indicators
 * and returns a composite score (0-100), severity classification,
 * indicator breakdown, and suggested action.
 */

import type { RawTransaction, PaymentRail } from "./transaction-engine";
import type { Severity } from "./safer-data";

export interface Indicator {
  id: string;
  label: string;
  weight: number;
  maxWeight: number;
  hit: boolean;
  detail: string;
  category: "behavioral" | "device" | "transaction" | "network" | "account";
}

export interface ScoringResult {
  score: number;
  severity: Severity;
  indicators: Indicator[];
  suggestedAction: string;
  fraudProbability: number;
  primaryRiskFactors: string[];
  xgbProbability?: number;
  lgbProbability?: number;
}

// ─── Amount thresholds per rail (values above are "high") ───────────────────

const HIGH_VALUE_THRESHOLDS: Record<PaymentRail, number> = {
  "QRIS": 2_000_000,
  "BI-FAST": 50_000_000,
  "RTGS": 500_000_000,
  "SKN": 50_000_000,
  "E-Wallet": 1_000_000,
  "Virtual Account": 10_000_000,
  "Kartu Debit": 5_000_000,
  "Kartu Kredit": 15_000_000,
  "Transfer": 25_000_000,
};

// ─── Score a transaction ────────────────────────────────────────────────────

export function scoreTransaction(tx: RawTransaction): ScoringResult {
  const h: Record<string, any> = tx._hints || {};
  const indicators: Indicator[] = [];

  // 1. Transaction amount relative to rail
  const threshold = HIGH_VALUE_THRESHOLDS[tx.rail] ?? 10_000_000;
  const amountRatio = tx.amount / threshold;
  const amountWeight = Math.min(20, Math.round(amountRatio * 10));
  indicators.push({
    id: "amount",
    label: "Transaction amount",
    weight: h.isHighValueForRail || amountRatio > 1.5 ? amountWeight : 0,
    maxWeight: 20,
    hit: h.isHighValueForRail || amountRatio > 1.5,
    detail: amountRatio > 1.5
      ? `Rp ${tx.amount.toLocaleString("id-ID")} sangat melebihi rata-rata untuk ${tx.rail} (threshold: Rp ${threshold.toLocaleString("id-ID")})`
      : `Rp ${tx.amount.toLocaleString("id-ID")} — dalam kisaran normal untuk ${tx.rail}`,
    category: "transaction",
  });

  // 2. Velocity anomaly
  indicators.push({
    id: "velocity",
    label: "Transaction velocity",
    weight: h.isVelocityAnomaly ? Math.min(18, h.velocityCount * 2) : 0,
    maxWeight: 18,
    hit: h.isVelocityAnomaly,
    detail: h.isVelocityAnomaly
      ? `${h.velocityCount} transaksi dalam 10 menit — pola burst terdeteksi`
      : `Velocity nominal (${h.velocityCount} tx)`,
    category: "behavioral",
  });

  // 3. Off-hours timing
  const hour = tx.timestamp.getHours();
  const isOffHours = h.isOffHours || hour < 5 || hour > 23;
  indicators.push({
    id: "timing",
    label: "Off-hours timing",
    weight: isOffHours ? 12 : 0,
    maxWeight: 12,
    hit: isOffHours,
    detail: isOffHours
      ? `Transaksi pada pukul ${hour.toString().padStart(2, "0")}:${tx.timestamp.getMinutes().toString().padStart(2, "0")} WIB — jam tidak wajar`
      : `Jam transaksi standard (${hour.toString().padStart(2, "0")}:${tx.timestamp.getMinutes().toString().padStart(2, "0")} WIB)`,
    category: "behavioral",
  });

  // 4. Device trust
  indicators.push({
    id: "device_trust",
    label: "Device trust",
    weight: h.isNewDevice ? 14 : 0,
    maxWeight: 14,
    hit: h.isNewDevice,
    detail: h.isNewDevice
      ? `Device fingerprint baru (${tx.deviceFingerprint.slice(0, 8)}…) — tidak ada riwayat`
      : `Device terpercaya (${tx.deviceBrand})`,
    category: "device",
  });

  // 5. Device mismatch
  indicators.push({
    id: "device_mismatch",
    label: "Device mismatch",
    weight: h.isDeviceMismatch ? 12 : 0,
    maxWeight: 12,
    hit: h.isDeviceMismatch,
    detail: h.isDeviceMismatch
      ? `Device berbeda dari sesi sebelumnya — possible session hijacking`
      : `Device konsisten dengan riwayat`,
    category: "device",
  });

  // 6. Geolocation anomaly
  indicators.push({
    id: "geo",
    label: "Geolocation anomaly",
    weight: h.isGeoMismatch ? Math.min(15, Math.round(h.geoDistanceKm / 100)) : 0,
    maxWeight: 15,
    hit: h.isGeoMismatch,
    detail: h.isGeoMismatch
      ? `Jarak ${h.geoDistanceKm} km dari lokasi transaksi terakhir (${tx.senderCity} → ${tx.receiverCity}) — impossible travel`
      : `Lokasi konsisten (${tx.senderCity})`,
    category: "behavioral",
  });

  // 7. Suspicious network / IP
  indicators.push({
    id: "network",
    label: "Suspicious network",
    weight: h.isSuspiciousIP ? 10 : 0,
    maxWeight: 10,
    hit: h.isSuspiciousIP,
    detail: h.isSuspiciousIP
      ? `IP ${tx.ipAddress} terdeteksi dalam threat intelligence feed`
      : `Network bersih (${tx.ipAddress})`,
    category: "network",
  });

  // 8. Account maturity
  indicators.push({
    id: "account_age",
    label: "Account maturity",
    weight: h.isNewAccount ? Math.min(10, Math.round((30 - tx.accountAgeDays) / 3)) : 0,
    maxWeight: 10,
    hit: h.isNewAccount,
    detail: h.isNewAccount
      ? `Akun baru (${tx.accountAgeDays} hari) — maturity rendah`
      : `Akun established (${Math.round(tx.accountAgeDays / 30)} bulan)`,
    category: "account",
  });

  // 9. Failed auth attempts
  indicators.push({
    id: "failed_auth",
    label: "Failed authentication",
    weight: h.hasFailedAttempts ? 10 : 0,
    maxWeight: 10,
    hit: h.hasFailedAttempts,
    detail: h.hasFailedAttempts
      ? `Multiple failed login/OTP attempts sebelum transaksi`
      : `Tidak ada kegagalan autentikasi`,
    category: "account",
  });

  // 10. Merchant risk category
  indicators.push({
    id: "merchant_risk",
    label: "Merchant risk category",
    weight: h.isRiskyMerchant ? 8 : 0,
    maxWeight: 8,
    hit: h.isRiskyMerchant,
    detail: h.isRiskyMerchant
      ? `Merchant "${tx.merchant}" (${tx.merchantCategory}) — kategori risiko tinggi`
      : `Merchant "${tx.merchant}" (${tx.merchantCategory}) — kategori normal`,
    category: "transaction",
  });

  // 11. Rail behavior (specific patterns)
  const railRisk = tx.rail === "BI-FAST" && tx.amount > 20_000_000;
  indicators.push({
    id: "rail_behavior",
    label: "Rail behavior pattern",
    weight: railRisk ? 7 : 0,
    maxWeight: 7,
    hit: railRisk,
    detail: railRisk
      ? `Transfer besar via BI-FAST (Rp ${tx.amount.toLocaleString("id-ID")}) — pola umum mule account`
      : `Penggunaan ${tx.rail} konsisten`,
    category: "transaction",
  });

  // 12. SIM swap
  indicators.push({
    id: "sim_swap",
    label: "SIM swap indicator",
    weight: h.isSimSwap ? 12 : 0,
    maxWeight: 12,
    hit: h.isSimSwap,
    detail: h.isSimSwap
      ? `Indikasi SIM swap terdeteksi — nomor telepon baru terdaftar pada device baru`
      : `Tidak ada indikasi SIM swap`,
    category: "device",
  });

  // 13. Unusual beneficiary
  indicators.push({
    id: "unusual_beneficiary",
    label: "Unusual beneficiary",
    weight: h.isUnusualBeneficiary ? 8 : 0,
    maxWeight: 8,
    hit: h.isUnusualBeneficiary,
    detail: h.isUnusualBeneficiary
      ? `Penerima "${tx.receiverName}" tidak ada dalam daftar beneficiary — first-time transfer`
      : `Beneficiary familiar`,
    category: "behavioral",
  });

  // 14. Cross-city transfer pattern
  const isCrossCity = tx.senderCity !== tx.receiverCity;
  const crossCityHighValue = isCrossCity && tx.amount > 10_000_000;
  indicators.push({
    id: "cross_city",
    label: "Cross-city transfer",
    weight: crossCityHighValue ? 5 : 0,
    maxWeight: 5,
    hit: crossCityHighValue,
    detail: crossCityHighValue
      ? `Transfer lintas kota (${tx.senderCity} → ${tx.receiverCity}) dengan nominal tinggi`
      : isCrossCity ? `Transfer lintas kota (nominal wajar)` : `Transfer lokal`,
    category: "transaction",
  });

  // 15. Time-amount correlation
  const timeAmountRisk = isOffHours && tx.amount > threshold;
  indicators.push({
    id: "time_amount",
    label: "Time-amount correlation",
    weight: timeAmountRisk ? 8 : 0,
    maxWeight: 8,
    hit: timeAmountRisk,
    detail: timeAmountRisk
      ? `Kombinasi jam tidak wajar + nominal tinggi — korelasi mencurigakan`
      : `Korelasi waktu-nominal normal`,
    category: "behavioral",
  });

  // ─── Compute total score ──────────────────────────────────────────────────
  let raw = 0;
  for (const ind of indicators) {
    if (ind.hit) raw += ind.weight;
  }
  const score = Math.min(100, raw);

  const severity: Severity =
    score >= 80 ? "critical" : score >= 60 ? "high" : score >= 35 ? "medium" : "low";

  const hitIndicators = indicators.filter(i => i.hit);
  const primaryRiskFactors = hitIndicators
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(i => i.label);

  const suggestedAction = {
    low: "Allow & continue passive monitoring",
    medium: "Flag untuk review — step-up authentication pada transaksi berikut",
    high: "Hold dana — analyst review segera & verifikasi identitas customer",
    critical: "Auto-block — eskalasi ke fraud operations & terminasi sesi",
  }[severity];

  const fraudProbability = Math.min(99, Math.round(score * 0.85 + (hitIndicators.length > 4 ? 10 : 0)));

  return {
    score,
    severity,
    indicators,
    suggestedAction,
    fraudProbability,
    primaryRiskFactors,
  };
}
