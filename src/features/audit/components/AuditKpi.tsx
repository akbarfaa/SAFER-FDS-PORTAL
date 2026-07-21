/**
 * Audit Queue Feature — KPI Cards Component
 */
import { ClipboardList, ArrowUpRight, CheckCircle2, BarChart3 } from "lucide-react";
import type { Transaction } from "@/lib/transaction-store";

interface AuditKpiProps {
  stats: any;
  txs: Transaction[];
}

export function AuditKpi({ stats, txs }: AuditKpiProps) {
  const auditedCount = stats.byAudit.audited_legitimate + stats.byAudit.audited_suspicious + stats.byAudit.cleared;
  const totalNonLow = txs.filter((t) => t.scoring.severity !== "low").length;
  const auditRate = totalNonLow > 0 ? Math.round((auditedCount / totalNonLow) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-4">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Pending Review</span>
          <ClipboardList className="h-4 w-4 text-warning" />
        </div>
        <div className="num mt-2 text-2xl font-semibold">{stats.byAudit.pending_review}</div>
        <div className="text-xs text-muted-foreground">{stats.byAudit.under_investigation} under investigation</div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Escalated</span>
          <ArrowUpRight className="h-4 w-4 text-critical" />
        </div>
        <div className="num mt-2 text-2xl font-semibold">{stats.byAudit.escalated}</div>
        <div className="text-xs text-muted-foreground">{stats.byAudit.blocked} blocked</div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Audited</span>
          <CheckCircle2 className="h-4 w-4 text-success" />
        </div>
        <div className="num mt-2 text-2xl font-semibold">{auditedCount}</div>
        <div className="text-xs text-muted-foreground">{stats.byAudit.cleared} cleared</div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Audit Rate</span>
          <BarChart3 className="h-4 w-4 text-primary" />
        </div>
        <div className="num mt-2 text-2xl font-semibold">{auditRate}%</div>
        <div className="text-xs text-muted-foreground">of flagged transactions</div>
      </div>
    </div>
  );
}
