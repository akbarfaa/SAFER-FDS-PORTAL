/**
 * Transaction Detail Feature — Indicator Breakdown Component
 */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Transaction } from "@/lib/transaction-store";

interface IndicatorBreakdownProps {
  tx: Transaction;
}

export function IndicatorBreakdown({ tx }: IndicatorBreakdownProps) {
  const [showAll, setShowAll] = useState(false);
  const hitIndicators = tx.scoring.indicators.filter((i) => i.hit);
  const normalIndicators = tx.scoring.indicators.filter((i) => !i.hit);

  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border px-5 py-3 text-sm font-semibold">
        Indicator Breakdown ({hitIndicators.length}/{tx.scoring.indicators.length} triggered)
      </div>
      <div className="divide-y divide-border">
        {hitIndicators.map((ind) => (
          <IndicatorRow key={ind.id} indicator={ind} />
        ))}
      </div>
      {normalIndicators.length > 0 && (
        <>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-border px-4 py-2 text-xs text-muted-foreground hover:bg-accent transition-colors"
          >
            {showAll ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showAll ? "Hide" : "Show"} {normalIndicators.length} normal indicators
          </button>
          {showAll && (
            <div className="divide-y divide-border border-t border-border">
              {normalIndicators.map((ind) => (
                <IndicatorRow key={ind.id} indicator={ind} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function IndicatorRow({ indicator: ind }: { indicator: { id: string; label: string; weight: number; maxWeight: number; hit: boolean; detail: string; category: string } }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3">
      <div className={`h-2 w-2 shrink-0 rounded-full ${ind.hit ? "bg-destructive" : "bg-success/60"}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{ind.label}</span>
          <div className="flex items-center gap-2">
            <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] text-muted-foreground">{ind.category}</span>
            <span className="num text-xs text-muted-foreground">
              {ind.hit ? `+${ind.weight}` : "0"}/{ind.maxWeight}
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{ind.detail}</div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all ${ind.hit ? "bg-destructive" : "bg-muted-foreground/20"}`}
            style={{ width: `${(ind.weight / ind.maxWeight) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
