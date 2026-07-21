/**
 * Fraud Monitoring Dashboard Route — Thin Orchestrator
 * Composes dashboard components from @/features/dashboard.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { useEffect, useState, useMemo } from "react";
import {
  useTransactions,
  useTransactionActions,
  type AuditStatus,
  type Transaction,
} from "@/lib/transaction-store";
import { TransactionDetail } from "@/components/safer/TransactionDetail";
import type { PaymentRail } from "@/lib/transaction-engine";
import type { Severity } from "@/lib/safer-data";
import { useTranslation } from "@/lib/i18n";
import {
  DashboardKpi,
  DashboardCharts,
  FilterBar,
  TransactionStreamTable,
} from "@/features/dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Monitoring · SAFER" },
      { name: "description", content: "Real-time fraud monitoring dashboard for Indonesian financial institutions." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();
  const txs = useTransactions();
  const actions = useTransactionActions();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isAutoOn, setIsAutoOn] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [railFilter, setRailFilter] = useState<PaymentRail | "all">("all");
  const [auditFilter, setAuditFilter] = useState<AuditStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const toggleAuto = () => {
    if (isAutoOn) {
      actions.stopAutoGenerate();
    } else {
      actions.startAutoGenerate();
    }
    setIsAutoOn(!isAutoOn);
  };

  useEffect(() => {
    return () => { actions.stopAutoGenerate(); };
  }, [actions]);

  const filtered = useMemo(() => {
    return txs.filter((tx) => {
      if (severityFilter !== "all" && tx.scoring.severity !== severityFilter) return false;
      if (railFilter !== "all" && tx.raw.rail !== railFilter) return false;
      if (auditFilter !== "all" && tx.auditStatus !== auditFilter) return false;
      return true;
    });
  }, [txs, severityFilter, railFilter, auditFilter]);

  const stats = actions.stats;
  const isFiltered = severityFilter !== "all" || railFilter !== "all" || auditFilter !== "all";

  useEffect(() => {
    if (selectedTx) {
      const updated = txs.find((t) => t.raw.id === selectedTx.raw.id);
      if (updated) setSelectedTx(updated);
    }
  }, [txs, selectedTx]);

  return (
    <AppShell title="Fraud Monitoring" subtitle="Live · jakarta-1 cluster">
      <FilterBar
        isAutoOn={isAutoOn}
        showFilters={showFilters}
        severityFilter={severityFilter}
        railFilter={railFilter}
        auditFilter={auditFilter}
        stats={stats}
        t={t}
        onToggleAuto={toggleAuto}
        onGenerateBatch={actions.generateBatch}
        onToggleShowFilters={() => setShowFilters((f) => !f)}
        onSeverityFilterChange={setSeverityFilter}
        onRailFilterChange={setRailFilter}
        onAuditFilterChange={setAuditFilter}
        onClearFilters={() => {
          setSeverityFilter("all");
          setRailFilter("all");
          setAuditFilter("all");
        }}
      />

      <DashboardKpi stats={stats} txs={txs} t={t} />

      <DashboardCharts stats={stats} t={t} />

      <TransactionStreamTable
        filteredTxs={filtered}
        totalCount={stats.total}
        isFiltered={isFiltered}
        txs={txs}
        t={t}
        onSelectTx={setSelectedTx}
        onToggleAuto={toggleAuto}
        onGenerateBatch={actions.generateBatch}
      />

      {selectedTx && (
        <TransactionDetail
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </AppShell>
  );
}
