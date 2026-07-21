/**
 * Risk Scoring Engine — Deterministic Scorer Evaluator
 */
import type { RawTransaction } from "../engines/transaction";
import type { Severity } from "../safer-data";
import { type Indicator, type ScoringResult, HIGH_VALUE_THRESHOLDS } from "./types";

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
  const isNewAcc = h.isNewAccount || tx.accountAgeDays < 30;
  indicators.push({
    id: "account_age",
    label: "Account maturity",
    weight: isNewAcc ? 10 : 0,
    maxWeight: 10,
    hit: isNewAcc,
    detail: isNewAcc
      ? `Umur akun ${tx.accountAgeDays} hari — akun baru berisiko tinggi`
      : `Akun mature (${tx.accountAgeDays} hari)`,
    category: "account",
  });

  // 9. Risky merchant category
  const isRiskyMerchant = h.isRiskyMerchant || tx.merchantCategory === "Crypto" || tx.merchantCategory === "Gaming";
  indicators.push({
    id: "merchant_risk",
    label: "Merchant risk class",
    weight: isRiskyMerchant ? 12 : 0,
    maxWeight: 12,
    hit: isRiskyMerchant,
    detail: isRiskyMerchant
      ? `Kategori merchant ${tx.merchantCategory} tergolong high-risk`
      : `Kategori merchant (${tx.merchantCategory}) nominal`,
    category: "transaction",
  });

  // 10. SIM swap signal
  indicators.push({
    id: "sim_swap",
    label: "SIM swap signal",
    weight: h.isSimSwap ? 16 : 0,
    maxWeight: 16,
    hit: h.isSimSwap,
    detail: h.isSimSwap
      ? `SIM card diganti dalam 48 jam terakhir — indikasi pembajakan OTP`
      : `SIM card stabil`,
    category: "device",
  });

  // 11. Failed auth attempts
  indicators.push({
    id: "failed_auth",
    label: "Failed auth attempts",
    weight: h.hasFailedAttempts ? 10 : 0,
    maxWeight: 10,
    hit: h.hasFailedAttempts,
    detail: h.hasFailedAttempts
      ? `Terdeteksi 3x gagal PIN/OTP sebelum transaksi ini`
      : `Tidak ada kegagalan autentikasi`,
    category: "behavioral",
  });

  // 12. Cross-city high speed
  const isCrossCity = tx.senderCity !== tx.receiverCity && tx.amount > 10_000_000;
  indicators.push({
    id: "cross_city",
    label: "Cross-city high value",
    weight: isCrossCity ? 8 : 0,
    maxWeight: 8,
    hit: isCrossCity,
    detail: isCrossCity
      ? `Transfer lintas kota (${tx.senderCity} → ${tx.receiverCity}) nominal tinggi`
      : `Transfer antar wilayah normal`,
    category: "transaction",
  });

  // 13. Unusual beneficiary
  indicators.push({
    id: "unusual_beneficiary",
    label: "Unusual beneficiary",
    weight: h.isUnusualBeneficiary ? 10 : 0,
    maxWeight: 10,
    hit: h.isUnusualBeneficiary,
    detail: h.isUnusualBeneficiary
      ? `Penerima baru pertama kali ditransfer dengan nominal besar`
      : `Penerima dikenal / histori ada`,
    category: "behavioral",
  });

  // 14. E-Wallet cashout pattern
  const isEwalletCashout = tx.rail === "E-Wallet" && tx.amount >= 2_000_000;
  indicators.push({
    id: "ewallet_cashout",
    label: "E-Wallet rapid cashout",
    weight: isEwalletCashout ? 8 : 0,
    maxWeight: 8,
    hit: isEwalletCashout,
    detail: isEwalletCashout
      ? `Top-up lalu cashout E-Wallet Rp ${tx.amount.toLocaleString("id-ID")} dalam rentang singkat`
      : `Penggunaan E-Wallet wajar`,
    category: "transaction",
  });

  // Calculate total score
  let totalScore = 0;
  for (const ind of indicators) {
    if (ind.hit) totalScore += ind.weight;
  }
  totalScore = Math.min(100, totalScore);

  // Severity classification
  let severity: Severity = "low";
  if (totalScore >= 80) severity = "critical";
  else if (totalScore >= 60) severity = "high";
  else if (totalScore >= 35) severity = "medium";

  // Suggested action based on severity
  const suggestedActions: Record<Severity, string> = {
    critical: "HOLD TRANSACTION IMMEDIATELY & FREEZE ACCOUNT",
    high: "HOLD TRANSACTION FOR MANUAL VERIFICATION",
    medium: "MONITOR CLOSELY & ENABLE STEP-UP AUTH",
    low: "ALLOW TRANSACTION",
  };

  const primaryRiskFactors = indicators
    .filter((i) => i.hit)
    .sort((a, b) => b.weight - a.weight)
    .map((i) => i.label);

  return {
    score: totalScore,
    severity,
    indicators,
    suggestedAction: suggestedActions[severity],
    fraudProbability: Math.min(99.9, Math.round(totalScore * 0.95 * 10) / 10),
    primaryRiskFactors,
  };
}
