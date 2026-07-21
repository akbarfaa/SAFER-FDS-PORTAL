/**
 * Transaction Detail Feature — Risk Score Summary Component
 */
import { AlertOctagon } from "lucide-react";
import { severityStyles } from "@/lib/safer-data";
import type { Transaction } from "@/lib/transaction-store";

interface RiskSummaryProps {
  tx: Transaction;
}

export function RiskSummary({ tx }: RiskSummaryProps) {
  const s = severityStyles[tx.scoring.severity];

  return (
    <div className={`rounded-lg border ${s.ring} ring-1 p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">AI Risk Score</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="num text-5xl font-semibold tracking-tight">{tx.scoring.score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Fraud Probability</div>
          <div className="num mt-1 text-2xl font-semibold">{tx.scoring.fraudProbability}%</div>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-700 ${
            tx.scoring.severity === "critical"
              ? "bg-critical"
              : tx.scoring.severity === "high"
                ? "bg-destructive"
                : tx.scoring.severity === "medium"
                  ? "bg-warning"
                  : "bg-success"
          }`}
          style={{ width: `${tx.scoring.score}%` }}
        />
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2.5 text-sm">
        <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Suggested Action</div>
          <div>{tx.scoring.suggestedAction}</div>
        </div>
      </div>
    </div>
  );
}
