/**
 * Transaction Store — Backend Response Mapper
 */
import type { Indicator } from "../risk-scoring";
import type { TransactionResponse } from "../api/api-client";
import type { Transaction } from "./transaction-types";

export function mapBackendTx(b: TransactionResponse): Transaction {
  const indicators: Indicator[] = [];
  let primaryRiskFactors: string[] = [];
  try {
    const factors = JSON.parse(b.primary_risk_factors || "[]");
    primaryRiskFactors = factors.map((f: any) => f.label || String(f.feature || ""));
    factors.forEach((f: any) => {
      indicators.push({
        id: f.feature,
        label: f.label,
        detail: f.label,
        weight: Math.round(f.shap_value * 100),
        maxWeight: 100,
        hit: true,
        category: "behavioral",
      });
    });
  } catch {
    const keys: Array<keyof TransactionResponse> = [
      "is_velocity_anomaly", "is_geo_mismatch", "is_off_hours",
      "is_high_value_for_rail", "is_suspicious_ip", "is_risky_merchant",
      "is_new_account", "has_failed_attempts", "is_device_mismatch",
      "is_sim_swap", "is_unusual_beneficiary", "is_new_device",
    ];
    keys.forEach((k) => {
      if (b[k] === true) {
        let category: Indicator["category"] = "behavioral";
        if (k.includes("device") || k.includes("sim")) category = "device";
        else if (k.includes("account") || k.includes("failed")) category = "account";
        else if (k.includes("beneficiary")) category = "network";
        else if (k.includes("value")) category = "transaction";

        const label = String(k).replace("is_", "").replace(/_/g, " ");
        primaryRiskFactors.push(label);

        indicators.push({
          id: k,
          label: label,
          detail: label,
          weight: 10,
          maxWeight: 10,
          hit: true,
          category: category,
        });
      }
    });
  }

  return {
    raw: {
      id: b.id,
      timestamp: new Date(b.timestamp),
      senderName: b.sender_name,
      senderAccount: b.sender_account,
      senderBank: b.sender_bank,
      senderCity: b.sender_city,
      senderProvince: b.sender_province,
      senderLat: b.sender_lat,
      senderLng: b.sender_lng,
      receiverName: b.receiver_name,
      receiverAccount: b.receiver_account,
      receiverBank: b.receiver_bank,
      receiverCity: b.receiver_city,
      receiverProvince: b.receiver_province,
      receiverLat: b.receiver_lat,
      receiverLng: b.receiver_lng,
      amount: b.amount,
      rail: b.payment_rail as any,
      ewalletProvider: b.ewallet_provider as any,
      merchant: b.merchant,
      merchantCategory: b.merchant_category,
      channel: b.channel,
      deviceType: b.device_type,
      deviceBrand: b.device_brand,
      deviceFingerprint: b.device_fingerprint,
      ipAddress: b.ip_address,
      isNewDevice: b.is_new_device,
      accountAgeDays: b.account_age_days,
      isVelocityAnomaly: b.is_velocity_anomaly,
      isGeoMismatch: b.is_geo_mismatch,
      isOffHours: b.is_off_hours,
      isHighValueForRail: b.is_high_value_for_rail,
      isSuspiciousIp: b.is_suspicious_ip,
      isRiskyMerchant: b.is_risky_merchant,
      isNewAccount: b.is_new_account,
      hasFailedAttempts: b.has_failed_attempts,
      isDeviceMismatch: b.is_device_mismatch,
      isSimSwap: b.is_sim_swap,
      isUnusualBeneficiary: b.is_unusual_beneficiary,
      velocityCount: b.velocity_count,
      geoDistanceKm: b.geo_distance_km,
    },
    scoring: {
      score: b.risk_score,
      severity: b.severity,
      fraudProbability: b.fraud_probability,
      xgbProbability: b.xgb_probability,
      lgbProbability: b.lgb_probability,
      indicators: indicators,
      suggestedAction: b.suggested_action,
      primaryRiskFactors: primaryRiskFactors,
    },
    aiReasoning: b.ai_reasoning,
    isReasoningLoading: false,
    auditStatus: b.audit_status as any,
    auditNotes: b.audit_notes,
    auditedBy: b.audited_by,
    auditedAt: b.audited_at ? new Date(b.audited_at) : null,
    auditHistory: [],
    createdAt: b.created_at ? new Date(b.created_at) : new Date(),
  };
}
