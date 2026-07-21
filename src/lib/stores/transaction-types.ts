/**
 * Transaction Store — Types & Interfaces
 */
import type { RawTransaction } from "../transaction-engine";
import type { ScoringResult } from "../risk-scoring";
import type { Severity } from "../safer-data";

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
  raw: RawTransaction;
  scoring: ScoringResult;
  aiReasoning: string;
  isReasoningLoading: boolean;
  auditStatus: AuditStatus;
  auditNotes: string;
  auditedBy: string | null;
  auditedAt: Date | null;
  auditHistory: AuditHistoryEntry[];
  createdAt: Date;
}

export interface AuditHistoryEntry {
  from: AuditStatus;
  to: AuditStatus;
  by: string;
  at: Date;
  notes?: string;
}

// Convenience accessors
export function txId(t: Transaction) { return t.raw.id; }
export function txSeverity(t: Transaction): Severity { return t.scoring.severity; }
export function txScore(t: Transaction) { return t.scoring.score; }
export function txAmount(t: Transaction) { return t.raw.amount; }
export function txRail(t: Transaction) { return t.raw.rail; }
