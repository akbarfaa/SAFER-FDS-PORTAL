/**
 * Dashboard Feature — KPI Cards Component
 */
import { Activity, AlertTriangle, ShieldCheck, Eye } from "lucide-react";
import { formatIDR } from "@/lib/safer-data";
import type { Transaction } from "@/lib/transaction-store";

interface DashboardKpiProps {
  stats: any;
  txs: Transaction[];
  t: (key: string) => string;
}

export function DashboardKpi({ stats, txs, t }: DashboardKpiProps) {
  const criticalBlockedAmount = stats.bySeverity.critical > 0
    ? txs.filter((t) => t.scoring.severity === "critical").reduce((s, t) => s + t.raw.amount, 0)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        icon={Activity}
        label={t('dashboard.kpi.total')}
        value={stats.total.toLocaleString()}
        delta={`${stats.byRail["QRIS"] || 0} QRIS · ${stats.byRail["BI-FAST"] || 0} BI-FAST`}
        tone="text-success"
        delay="0s"
      />
      <KpiCard
        icon={AlertTriangle}
        label={t('dashboard.kpi.flagged')}
        value={stats.flaggedCount.toLocaleString()}
        delta={`${((stats.flaggedCount / Math.max(1, stats.total)) * 100).toFixed(1)}% rate`}
        tone="text-warning"
        delay="0.05s"
      />
      <KpiCard
        icon={ShieldCheck}
        label={t('dashboard.kpi.blocked')}
        value={formatIDR(criticalBlockedAmount)}
        delta="auto-blocked"
        tone="text-primary"
        delay="0.1s"
      />
      <KpiCard
        icon={Eye}
        label={t('dashboard.kpi.pending')}
        value={stats.pendingReview.toLocaleString()}
        delta={`${stats.byAudit.escalated} escalated`}
        tone="text-success"
        delay="0.15s"
      />
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  tone,
  delay = "0s",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  tone: string;
  delay?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 card-enter" style={{ animationDelay: delay }}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className="num mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
    </div>
  );
}
