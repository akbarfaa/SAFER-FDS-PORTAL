/**
 * Risk Scoring Engine — Types & Thresholds
 */
import type { PaymentRail } from "../engines/transaction";
import type { Severity } from "../safer-data";

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

export const HIGH_VALUE_THRESHOLDS: Record<PaymentRail, number> = {
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
