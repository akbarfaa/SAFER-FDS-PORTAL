/**
 * SAFER — Transaction Store
 * Centralised state management for all transactions, synced with FastAPI & ML scoring backend.
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
} from "./transaction-engine";
import { scoreTransaction } from "./risk-scoring";
import { generateTemplateReasoning, type LLMConfig } from "./ai-reasoning";
import { api } from "./api/api-client";
import {
  type AuditStatus,
  type Transaction,
  type AuditHistoryEntry,
} from "./stores/transaction-types";
import { mapBackendTx } from "./stores/transaction-mapper";

// Re-export all types and helper accessors for backward compatibility
export * from "./stores/transaction-types";
export { mapBackendTx } from "./stores/transaction-mapper";

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
    if (typeof window !== "undefined") {
      setTimeout(() => {
        try {
          const saved = localStorage.getItem("safer_llm_config");
          if (saved) this._llmConfig = JSON.parse(saved);
        } catch { /* ignore */ }

        this.loadInitialTransactions();
        this.startPolling();
      }, 0);
    }
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
    }, 4000);
  };

  stopPolling = () => {
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
  };

  subscribe = (listener: Listener) => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };

  getSnapshot = () => this._transactions;

  private _emit() {
    this._transactions = [...this._transactions];
    this._listeners.forEach(l => l());
  }

  generateBatch = async (count?: number, forceHighRisk = false) => {
    const n = count ?? this._batchSize;
    try {
      const backendTxs = await api.generateBatch(n, forceHighRisk ? 1.0 : this._fraudRatio);
      const newTxs = backendTxs.map(mapBackendTx);
      this._transactions = [...newTxs, ...this._transactions];
      this._emit();
    } catch (err) {
      console.error("[TransactionStore] Batch generate failed. Falling back to local scoring:", err);
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

  injectTransactions = (txs: Transaction[]) => {
    const existingIds = new Set(this._transactions.map(t => t.raw.id));
    const newTxs = txs.filter(t => !existingIds.has(t.raw.id));
    if (newTxs.length === 0) return;
    this._transactions = [...newTxs, ...this._transactions];
    this._emit();
  };

  updateAuditStatus = async (txId: string, newStatus: AuditStatus, notes?: string) => {
    try {
      await api.updateAuditStatus(txId, newStatus, notes || "", "Analyst Demo");
    } catch (err) {
      console.error("[TransactionStore] Failed to update audit status on backend:", err);
    }

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
    if (newStatus === "under_investigation") {
      try {
        await api.investigateCluster(txIds, notes || "Cluster investigation", "Analyst Demo (Graph)");
      } catch (err) {
        console.error("[TransactionStore] Bulk status update failed on backend:", err);
      }
    } else {
      for (const txId of txIds) {
        try {
          await api.updateAuditStatus(txId, newStatus, notes || "", "Analyst Demo (Graph)");
        } catch { /* ignore single errors */ }
      }
    }

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

  get isAutoGenerating() { return this._autoInterval !== null; }

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
    if (this._autoInterval) this.startAutoGenerate();
  }

  get fraudRatio() { return this._fraudRatio; }
  set fraudRatio(ratio: number) { this._fraudRatio = Math.max(0, Math.min(1, ratio)); }

  get batchSize() { return this._batchSize; }
  set batchSize(n: number) { this._batchSize = Math.max(1, Math.min(10, n)); }

  reset = () => {
    this.stopAutoGenerate();
    this._transactions = [];
    resetTransactionCounter();
    this._emit();
  };

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
