/**
 * SAFER — Transaction Store
 *
 * Centralised state management for all transactions, synced with the
 * FastAPI database and ML scoring backend.
 */

import {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  createElement,
  type ReactNode,
} from "react";
import {
  generateTransactionBatch,
  resetTransactionCounter,
  type RawTransaction,
} from "./transaction-engine";
import { scoreTransaction, type ScoringResult, type Indicator } from "./risk-scoring";
import { generateTemplateReasoning, generateLLMReasoning, type LLMConfig } from "./ai-reasoning";
import type { Severity } from "./safer-data";
import { api, type TransactionResponse } from "./api/api-client";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AuditStatus =
  | "pending_review"
  | "under_investigation"
  | "planned_audit"
  | "audited_legitimate"
  | "audited_suspicious"
  | "escalated"
  | "blocked"
  | "cleared";

export const AUDIT_STATUS_META: Record<
  AuditStatus,
  { label: string; color: string; bg: string }
> = {
  pending_review: {
    label: "Pending Review",
    color: "text-muted-foreground",
    bg: "bg-muted/50",
  },
  under_investigation: {
    label: "Under Investigation",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  planned_audit: {
    label: "Planned Audit",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  audited_legitimate: {
    label: "Audited — Legitimate",
    color: "text-success",
    bg: "bg-success/10",
  },
  audited_suspicious: {
    label: "Audited — Suspicious",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  escalated: {
    label: "Escalated",
    color: "text-critical",
    bg: "bg-critical/10",
  },
  blocked: {
    label: "Blocked",
    color: "text-destructive",
    bg: "bg-destructive/15",
  },
  cleared: {
    label: "Cleared",
    color: "text-success",
    bg: "bg-success/15",
  },
};

export interface Transaction {
  // Raw data
  raw: RawTransaction;
  // Scoring
  scoring: ScoringResult;
  // AI reasoning
  aiReasoning: string;
  isReasoningLoading: boolean;
  // Audit
  auditStatus: AuditStatus;
  auditNotes: string;
  auditedBy: string | null;
  auditedAt: Date | null;
  auditHistory: AuditHistoryEntry[];
  // Metadata
  createdAt: Date;
}

export interface AuditHistoryEntry {
  from: AuditStatus;
  to: AuditStatus;
  by: string;
  at: Date;
  notes?: string;
}

// Convenience accessors from raw data
export function txId(t: Transaction) { return t.raw.id; }
export function txSeverity(t: Transaction): Severity { return t.scoring.severity; }
export function txScore(t: Transaction) { return t.scoring.score; }
export function txAmount(t: Transaction) { return t.raw.amount; }
export function txRail(t: Transaction) { return t.raw.rail; }

// ─── Mapper Function ────────────────────────────────────────────────────────

export function mapBackendTx(b: TransactionResponse): Transaction {
  const indicators: Indicator[] = [];
  try {
    const factors = JSON.parse(b.primary_risk_factors || "[]");
    factors.forEach((f: any) => {
      indicators.push({
        id: f.feature,
        label: f.label,
        detail: f.label,
        weight: Math.round(f.shap_value * 100),
        maxWeight: 100,
        hit: true
      });
    });
  } catch (e) {
    // If no risk factors JSON, populate from active binary columns
    const keys: Array<keyof TransactionResponse> = [
      "is_velocity_anomaly", "is_geo_mismatch", "is_off_hours",
      "is_high_value_for_rail", "is_suspicious_ip", "is_risky_merchant",
      "is_new_account", "has_failed_attempts", "is_device_mismatch",
      "is_sim_swap", "is_unusual_beneficiary", "is_new_device"
    ];
    keys.forEach(k => {
      if (b[k] === true) {
        indicators.push({
          id: k,
          label: k.replace("is_", "").replace(/_/g, " "),
          detail: k.replace("is_", "").replace(/_/g, " "),
          weight: 10,
          maxWeight: 10,
          hit: true
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
      ewalletProvider: b.ewallet_provider,
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

// ─── Store (external store pattern for perf) ────────────────────────────────

type Listener = () => void;

class TransactionStore {
  private _transactions: Transaction[] = [];
  private _listeners = new Set<Listener>();
  private _llmConfig: LLMConfig = {
    enabled: false,
    provider: "groq",
    apiKey: "",
    language: "id",
  };
  private _autoInterval: ReturnType<typeof setInterval> | null = null;
  private _autoIntervalMs = 15_000;
  private _pollInterval: ReturnType<typeof setInterval> | null = null;
  private _fraudRatio = 0.18;
  private _batchSize = 3;

  constructor() {
    // Restore LLM config from localStorage
    try {
      const saved = localStorage.getItem("safer_llm_config");
      if (saved) this._llmConfig = JSON.parse(saved);
    } catch { /* ignore */ }

    // Initial load from backend database
    this.loadInitialTransactions();

    // Start background polling to keep client sync with backend DB
    this.startPolling();
  }

  loadInitialTransactions = async () => {
    try {
      const res = await api.getTransactions({ page: 1, page_size: 100 });
      this._transactions = res.items.map(mapBackendTx);
      this._emit();
    } catch (err) {
      console.warn("[TransactionStore] Failed to fetch initial data from backend. Falling back offline.", err);
    }
  };

  startPolling = () => {
    this.stopPolling();
    this._pollInterval = setInterval(async () => {
      try {
        const res = await api.getTransactions({ page: 1, page_size: 100 });
        const backendTxs = res.items.map(mapBackendTx);
        
        // Check for new transactions or changes in status to avoid unnecessary emits
        const localIds = new Set(this._transactions.map(t => t.raw.id));
        const hasNew = backendTxs.some(t => !localIds.has(t.raw.id));
        
        let hasStatusChange = false;
        for (const btx of backendTxs) {
          const ltx = this._transactions.find(t => t.raw.id === btx.raw.id);
          if (ltx && ltx.auditStatus !== btx.auditStatus) {
            hasStatusChange = true;
            break;
          }
        }
        
        if (hasNew || hasStatusChange || this._transactions.length !== backendTxs.length) {
          this._transactions = backendTxs;
          this._emit();
        }
      } catch (err) {
        console.warn("[TransactionStore] Background sync polling failed:", err);
      }
    }, 4000); // Poll every 4 seconds
  };

  stopPolling = () => {
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
  };

  // ── Subscriptions ──────────────────────────────────────────────────────
  subscribe = (listener: Listener) => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };

  getSnapshot = () => this._transactions;

  private _emit() {
    this._transactions = [...this._transactions];
    this._listeners.forEach(l => l());
  }

  // ── Transaction Generation ─────────────────────────────────────────────
  generateBatch = async (count?: number, forceHighRisk = false) => {
    const n = count ?? this._batchSize;
    try {
      // Generate through FastAPI Data + Scoring services
      const backendTxs = await api.generateBatch(n, this._fraudRatio);
      const newTxs = backendTxs.map(mapBackendTx);
      this._transactions = [...newTxs, ...this._transactions];
      this._emit();
    } catch (err) {
      console.error("[TransactionStore] Batch generate failed. Falling back to local scoring:", err);
      // Local fallback
      const rawBatch = generateTransactionBatch(n, this._fraudRatio, forceHighRisk);
      const fallbackTxs: Transaction[] = [];
      for (const raw of rawBatch) {
        const scoring = scoreTransaction(raw);
        fallbackTxs.push({
          raw,
          scoring,
          aiReasoning: generateTemplateReasoning(raw, scoring),
          isReasoningLoading: false,
          auditStatus: scoring.severity === "critical" ? "blocked" : "pending_review",
          auditNotes: "Fallback Offline Mode",
          auditedBy: null,
          auditedAt: null,
          auditHistory: [],
          createdAt: new Date(),
        });
      }
      this._transactions = [...fallbackTxs, ...this._transactions];
      this._emit();
    }
  };

  // ── Scenario Injection ──────────────────────────────────────────────────
  injectTransactions = (txs: Transaction[]) => {
    const existingIds = new Set(this._transactions.map(t => t.raw.id));
    const newTxs = txs.filter(t => !existingIds.has(t.raw.id));
    
    if (newTxs.length === 0) return;
    
    this._transactions = [...newTxs, ...this._transactions];
    this._emit();
  };

  // ── Audit Actions ──────────────────────────────────────────────────────
  updateAuditStatus = async (txId: string, newStatus: AuditStatus, notes?: string) => {
    // 1. Pessimistically update the backend first
    try {
      await api.updateAuditStatus(txId, newStatus, notes || "", "Analyst Demo");
    } catch (err) {
      console.error("[TransactionStore] Failed to update audit status on backend:", err);
    }

    // 2. Reflect change in local memory
    const idx = this._transactions.findIndex(t => t.raw.id === txId);
    if (idx === -1) return;

    const tx = this._transactions[idx];
    const historyEntry: AuditHistoryEntry = {
      from: tx.auditStatus,
      to: newStatus,
      by: "Analyst Demo",
      at: new Date(),
      notes,
    };

    this._transactions[idx] = {
      ...tx,
      auditStatus: newStatus,
      auditNotes: notes ?? tx.auditNotes,
      auditedBy: "Analyst Demo",
      auditedAt: new Date(),
      auditHistory: [...tx.auditHistory, historyEntry],
    };
    this._emit();
  };

  updateAuditStatusBulk = async (txIds: string[], newStatus: AuditStatus, notes?: string) => {
    // 1. Update backend (special gateway cluster route)
    if (newStatus === "under_investigation") {
      try {
        await api.investigateCluster(txIds, notes || "Cluster investigation", "Analyst Demo (Graph)");
      } catch (err) {
        console.error("[TransactionStore] Bulk status update failed on backend:", err);
      }
    } else {
      // Sequence them otherwise
      for (const txId of txIds) {
        try {
          await api.updateAuditStatus(txId, newStatus, notes || "", "Analyst Demo (Graph)");
        } catch (e) { /* ignore single errors */ }
      }
    }

    // 2. Reflect in local memory
    let changed = false;
    const now = new Date();
    
    this._transactions = this._transactions.map(tx => {
      if (txIds.includes(tx.raw.id)) {
        changed = true;
        const historyEntry: AuditHistoryEntry = {
          from: tx.auditStatus,
          to: newStatus,
          by: "Analyst Demo (Graph)",
          at: now,
          notes,
        };
        return {
          ...tx,
          auditStatus: newStatus,
          auditNotes: notes ?? tx.auditNotes,
          auditedBy: "Analyst Demo (Graph)",
          auditedAt: now,
          auditHistory: [...tx.auditHistory, historyEntry],
        };
      }
      return tx;
    });

    if (changed) this._emit();
  };

  updateAuditNotes = (txId: string, notes: string) => {
    const idx = this._transactions.findIndex(t => t.raw.id === txId);
    if (idx === -1) return;
    this._transactions[idx] = { ...this._transactions[idx], auditNotes: notes };
    this._emit();
  };

  // ── Auto-generation ────────────────────────────────────────────────────
  startAutoGenerate = () => {
    this.stopAutoGenerate();
    this._autoInterval = setInterval(() => {
      this.generateBatch();
    }, this._autoIntervalMs);
    this.generateBatch();
  };

  stopAutoGenerate = () => {
    if (this._autoInterval) {
      clearInterval(this._autoInterval);
      this._autoInterval = null;
    }
  };

  get isAutoGenerating() {
    return this._autoInterval !== null;
  }

  // ── Settings ───────────────────────────────────────────────────────────
  get llmConfig() { return this._llmConfig; }
  set llmConfig(cfg: LLMConfig) {
    this._llmConfig = cfg;
    try {
      localStorage.setItem("safer_llm_config", JSON.stringify(cfg));
    } catch { /* ignore */ }
  }

  get autoIntervalMs() { return this._autoIntervalMs; }
  set autoIntervalMs(ms: number) {
    this._autoIntervalMs = Math.max(3000, Math.min(60000, ms));
    if (this._autoInterval) {
      this.startAutoGenerate();
    }
  }

  get fraudRatio() { return this._fraudRatio; }
  set fraudRatio(ratio: number) { this._fraudRatio = Math.max(0, Math.min(1, ratio)); }

  get batchSize() { return this._batchSize; }
  set batchSize(n: number) { this._batchSize = Math.max(1, Math.min(10, n)); }

  // ── Reset ──────────────────────────────────────────────────────────────
  reset = () => {
    this.stopAutoGenerate();
    this._transactions = [];
    resetTransactionCounter();
    this._emit();
  };

  // ── Stats ──────────────────────────────────────────────────────────────
  get stats() {
    const txs = this._transactions;
    const total = txs.length;
    const bySeverity = { low: 0, medium: 0, high: 0, critical: 0 };
    const byAudit: Record<AuditStatus, number> = {
      pending_review: 0,
      under_investigation: 0,
      planned_audit: 0,
      audited_legitimate: 0,
      audited_suspicious: 0,
      escalated: 0,
      blocked: 0,
      cleared: 0,
    };
    let totalAmount = 0;
    let flaggedAmount = 0;
    const byRail: Record<string, number> = {};

    for (const tx of txs) {
      bySeverity[tx.scoring.severity]++;
      byAudit[tx.auditStatus]++;
      totalAmount += tx.raw.amount;
      if (tx.scoring.severity !== "low") flaggedAmount += tx.raw.amount;
      byRail[tx.raw.rail] = (byRail[tx.raw.rail] || 0) + 1;
    }

    return {
      total,
      bySeverity,
      byAudit,
      totalAmount,
      flaggedAmount,
      flaggedCount: total - bySeverity.low,
      pendingReview: byAudit.pending_review + byAudit.under_investigation,
      byRail,
    };
  }
}

// ─── Singleton & Context ────────────────────────────────────────────────────

const store = new TransactionStore();

const StoreContext = createContext<TransactionStore>(store);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef(store);
  return createElement(StoreContext.Provider, { value: storeRef.current }, children);
}

export function useTransactions(): Transaction[] {
  const s = useContext(StoreContext);
  return useSyncExternalStore(s.subscribe, s.getSnapshot, s.getSnapshot);
}

export function useTransactionActions() {
  const s = useContext(StoreContext);
  return {
    generateBatch: s.generateBatch,
    injectTransactions: s.injectTransactions,
    startAutoGenerate: s.startAutoGenerate,
    stopAutoGenerate: s.stopAutoGenerate,
    updateAuditStatus: s.updateAuditStatus,
    updateAuditStatusBulk: s.updateAuditStatusBulk,
    updateAuditNotes: s.updateAuditNotes,
    reset: s.reset,
    get isAutoGenerating() { return s.isAutoGenerating; },
    get stats() { return s.stats; },
    get llmConfig() { return s.llmConfig; },
    set llmConfig(cfg: LLMConfig) { s.llmConfig = cfg; },
    get autoIntervalMs() { return s.autoIntervalMs; },
    set autoIntervalMs(ms: number) { s.autoIntervalMs = ms; },
    get fraudRatio() { return s.fraudRatio; },
    set fraudRatio(r: number) { s.fraudRatio = r; },
    get batchSize() { return s.batchSize; },
    set batchSize(n: number) { s.batchSize = n; },
  };
}

export function useTransaction(id: string): Transaction | undefined {
  const txs = useTransactions();
  return txs.find(t => t.raw.id === id);
}
