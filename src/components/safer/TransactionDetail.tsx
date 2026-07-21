/**
 * SAFER — Transaction Detail Drawer Panel
 * Composes components from @/features/transaction-detail.
 */
import { X, Brain, Loader2 } from "lucide-react";
import { severityStyles } from "@/lib/safer-data";
import { type Transaction } from "@/lib/transaction-store";
import { AuditStatusBadge } from "@/components/safer/AuditStatusBadge";
import {
  RiskSummary,
  TransactionGrid,
  IndicatorBreakdown,
  AuditControls,
} from "@/features/transaction-detail";

interface Props {
  transaction: Transaction;
  onClose: () => void;
}

export function TransactionDetail({ transaction: tx, onClose }: Props) {
  const s = severityStyles[tx.scoring.severity];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-y-auto bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold">{tx.raw.id}</span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.text}`}>
                {s.label}
              </span>
              <AuditStatusBadge status={tx.auditStatus} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {tx.raw.timestamp.toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "medium",
              })}
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <RiskSummary tx={tx} />
          <TransactionGrid tx={tx} />

          {/* AI Reasoning */}
          <div className="rounded-lg border border-border">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">AI Fraud Analysis</span>
              {tx.isReasoningLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            </div>
            <div className="px-5 py-4 text-sm leading-relaxed whitespace-pre-line">
              {tx.aiReasoning || "Generating analysis…"}
            </div>
          </div>

          <IndicatorBreakdown tx={tx} />
          <AuditControls tx={tx} />
        </div>
      </div>
    </div>
  );
}
