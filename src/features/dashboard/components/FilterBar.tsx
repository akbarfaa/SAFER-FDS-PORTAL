/**
 * Dashboard Feature — Control & Filter Bar Component
 */
import { Play, Pause, Zap, Target, Filter } from "lucide-react";
import { AUDIT_STATUS_META, type AuditStatus } from "@/lib/transaction-store";
import type { PaymentRail } from "@/lib/transaction-engine";
import type { Severity } from "@/lib/safer-data";

interface FilterBarProps {
  isAutoOn: boolean;
  showFilters: boolean;
  severityFilter: Severity | "all";
  railFilter: PaymentRail | "all";
  auditFilter: AuditStatus | "all";
  stats: any;
  t: (key: string) => string;
  onToggleAuto: () => void;
  onGenerateBatch: (count?: number, forceHighRisk?: boolean) => void;
  onToggleShowFilters: () => void;
  onSeverityFilterChange: (val: Severity | "all") => void;
  onRailFilterChange: (val: PaymentRail | "all") => void;
  onAuditFilterChange: (val: AuditStatus | "all") => void;
  onClearFilters: () => void;
}

export function FilterBar({
  isAutoOn,
  showFilters,
  severityFilter,
  railFilter,
  auditFilter,
  stats,
  t,
  onToggleAuto,
  onGenerateBatch,
  onToggleShowFilters,
  onSeverityFilterChange,
  onRailFilterChange,
  onAuditFilterChange,
  onClearFilters,
}: FilterBarProps) {
  const isFiltered = severityFilter !== "all" || railFilter !== "all" || auditFilter !== "all";

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={onToggleAuto}
          className={`inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors ${
            isAutoOn
              ? "bg-success text-white hover:bg-success/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isAutoOn ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isAutoOn ? t('dashboard.btn.pauseStream') : t('dashboard.btn.startStream')}
        </button>
        <button
          onClick={() => onGenerateBatch()}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm transition-colors hover:bg-accent"
        >
          <Zap className="h-3.5 w-3.5 text-warning" /> {t('dashboard.btn.genBatch')}
        </button>
        <button
          onClick={() => onGenerateBatch(1, true)}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-destructive/30 bg-card px-4 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <Target className="h-3.5 w-3.5" /> {t('dashboard.btn.scenario')}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onToggleShowFilters}
            className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs transition-colors ${
              showFilters ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"
            }`}
          >
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          {isAutoOn && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Streaming
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium text-muted-foreground uppercase">{t('dashboard.filter.severity')}</label>
            <div className="flex gap-1">
              {(["all", "low", "medium", "high", "critical"] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => onSeverityFilterChange(sev)}
                  className={`rounded px-2 py-1 text-[11px] transition-colors ${
                    severityFilter === sev
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-accent"
                  }`}
                >
                  {sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
                  {sev !== "all" && <span className="ml-1 num">{stats.bySeverity[sev]}</span>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-muted-foreground uppercase">{t('dashboard.filter.rail')}</label>
            <select
              value={railFilter}
              onChange={(e) => onRailFilterChange(e.target.value as PaymentRail | "all")}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="all">{t('dashboard.filter.all')}</option>
              {["QRIS", "BI-FAST", "RTGS", "SKN", "E-Wallet", "Virtual Account", "Kartu Debit", "Kartu Kredit", "Transfer"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-muted-foreground uppercase">{t('dashboard.filter.auditStatus')}</label>
            <select
              value={auditFilter}
              onChange={(e) => onAuditFilterChange(e.target.value as AuditStatus | "all")}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="all">{t('dashboard.filter.all')}</option>
              {Object.entries(AUDIT_STATUS_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
          {isFiltered && (
            <button onClick={onClearFilters} className="ml-auto text-xs text-primary hover:underline">
              {t('dashboard.filter.clear')}
            </button>
          )}
        </div>
      )}
    </>
  );
}
