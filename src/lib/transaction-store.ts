/**
 * SAFER — Transaction Store
 *
 * React Context providing centralised, in-memory state management for
 * all transactions in the demo session.  Handles generation, scoring,
 * AI reasoning, audit status lifecycle, and filtering.
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
  private _fraudRatio = 0.18;
  private _batchSize = 3;

  constructor() {
    // Restore LLM config from localStorage
    try {
      const saved = localStorage.getItem("safer_llm_config");
      if (saved) this._llmConfig = JSON.parse(saved);
    } catch { /* ignore */ }
  }

  // ── Subscriptions ──────────────────────────────────────────────────────
  subscribe = (listener: Listener) => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };

  getSnapshot = () => this._transactions;

  private _emit() {
    // Create new array ref to trigger re-renders
    this._transactions = [...this._transactions];
    this._listeners.forEach(l => l());
  }

  // ── Transaction Generation ─────────────────────────────────────────────
  generateBatch = async (count?: number, forceHighRisk = false) => {
    const n = count ?? this._batchSize;
    const rawBatch = generateTransactionBatch(n, this._fraudRatio, forceHighRisk);
    const newTxs: Transaction[] = [];

    for (const raw of rawBatch) {
      const scoring = scoreTransaction(raw);
      const auditStatus: AuditStatus =
        scoring.severity === "critical" ? "blocked"
          : scoring.severity === "high" ? "pending_review"
            : "pending_review";

      const tx: Transaction = {
        raw,
        scoring,
        aiReasoning: "",
        isReasoningLoading: true,
        auditStatus,
        auditNotes: "",
        auditedBy: null,
        auditedAt: null,
        auditHistory: [],
        createdAt: new Date(),
      };

      // Generate template reasoning immediately (sync)
      tx.aiReasoning = generateTemplateReasoning(raw, scoring);
      tx.isReasoningLoading = false;

      newTxs.push(tx);
    }

    // Prepend new transactions (newest first)
    this._transactions = [...newTxs, ...this._transactions];
    this._emit();

    // If LLM is enabled, upgrade reasoning asynchronously
    if (this._llmConfig.enabled && this._llmConfig.apiKey) {
      for (const tx of newTxs) {
        this._upgradeLLMReasoning(tx);
      }
    }
  };

  private async _upgradeLLMReasoning(tx: Transaction) {
    try {
      const idx = this._transactions.findIndex(t => t.raw.id === tx.raw.id);
      if (idx === -1) return;

      this._transactions[idx] = { ...this._transactions[idx], isReasoningLoading: true };
      this._emit();

      const reasoning = await generateLLMReasoning(tx.raw, tx.scoring, this._llmConfig);

      const idx2 = this._transactions.findIndex(t => t.raw.id === tx.raw.id);
      if (idx2 === -1) return;

      this._transactions[idx2] = {
        ...this._transactions[idx2],
        aiReasoning: reasoning,
        isReasoningLoading: false,
      };
      this._emit();
    } catch {
      const idx = this._transactions.findIndex(t => t.raw.id === tx.raw.id);
      if (idx !== -1) {
        this._transactions[idx] = { ...this._transactions[idx], isReasoningLoading: false };
        this._emit();
      }
    }
  }

  // ── Scenario Injection ──────────────────────────────────────────────────
  injectTransactions = (txs: Transaction[]) => {
    // Filter out transactions that already exist (by ID)
    const existingIds = new Set(this._transactions.map(t => t.raw.id));
    const newTxs = txs.filter(t => !existingIds.has(t.raw.id));
    
    if (newTxs.length === 0) return;
    
    // Prepend new transactions
    this._transactions = [...newTxs, ...this._transactions];
    this._emit();
    
    // Upgrade LLM reasoning if enabled
    if (this._llmConfig.enabled && this._llmConfig.apiKey) {
      for (const tx of newTxs) {
        this._upgradeLLMReasoning(tx);
      }
    }
  };

  // ── Audit Actions ──────────────────────────────────────────────────────
  updateAuditStatus = (txId: string, newStatus: AuditStatus, notes?: string) => {
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

  updateAuditStatusBulk = (txIds: string[], newStatus: AuditStatus, notes?: string) => {
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
    // Generate one batch immediately
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
    // Restart if running
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
  // Use a ref so the same store instance is shared across the tree
  const storeRef = useRef(store);
  return createElement(StoreContext.Provider, { value: storeRef.current }, children);
}

/** Hook — returns the full transaction list (triggers re-render on changes) */
export function useTransactions(): Transaction[] {
  const s = useContext(StoreContext);
  return useSyncExternalStore(s.subscribe, s.getSnapshot, s.getSnapshot);
}

/** Hook — returns store actions (stable refs) */
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

/** Hook — returns a single transaction by ID */
export function useTransaction(id: string): Transaction | undefined {
  const txs = useTransactions();
  return txs.find(t => t.raw.id === id);
}
