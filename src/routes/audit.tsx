/**
 * Audit Queue Route — Thin Orchestrator
 * Composes audit components from @/features/audit.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { useState, useMemo, useEffect } from "react";
import {
  useTransactions,
  useTransactionActions,
  AUDIT_STATUS_META,
  type AuditStatus,
  type Transaction,
} from "@/lib/transaction-store";
import { TransactionDetail } from "@/components/safer/TransactionDetail";
import { AUDIT_STATUS_ICONS } from "@/components/safer/AuditStatusBadge";
import { AuditKpi, AuditTable } from "@/features/audit";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Queue · SAFER" },
      { name: "description", content: "Manual audit workflow for fraud investigation and transaction review." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuditPage,
});

const TAB_ORDER: (AuditStatus | "all")[] = [
  "all",
  "pending_review",
  "under_investigation",
  "planned_audit",
  "audited_suspicious",
  "audited_legitimate",
  "escalated",
  "blocked",
  "cleared",
];

function AuditPage() {
  const txs = useTransactions();
  const actions = useTransactionActions();
  const [activeTab, setActiveTab] = useState<AuditStatus | "all">("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const stats = actions.stats;

  const filtered = useMemo(() => {
    if (activeTab === "all") return txs;
    return txs.filter((t) => t.auditStatus === activeTab);
  }, [txs, activeTab]);

  useEffect(() => {
    if (selectedTx) {
      const updated = txs.find((t) => t.raw.id === selectedTx.raw.id);
      if (updated) setSelectedTx(updated);
    }
  }, [txs, selectedTx]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((t) => t.raw.id)));
    }
  };

  const handleBulkAction = (status: AuditStatus) => {
    selectedIds.forEach((id) => {
      actions.updateAuditStatus(id, status);
    });
    setSelectedIds(new Set());
  };

  const getTabCount = (tab: AuditStatus | "all") => {
    if (tab === "all") return txs.length;
    return stats.byAudit[tab] || 0;
  };

  return (
    <AppShell title="Audit Queue" subtitle="Manual review & investigation workflow">
      <AuditKpi stats={stats} txs={txs} />

      {/* Tab Bar */}
      <div className="mb-4 flex flex-wrap gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1.5">
        {TAB_ORDER.map((tab) => {
          const count = getTabCount(tab);
          const meta = tab === "all" ? null : AUDIT_STATUS_META[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedIds(new Set()); }}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {meta ? (
                <>
                  {(() => {
                    const Icon = AUDIT_STATUS_ICONS[tab as AuditStatus];
                    return <Icon className="h-3.5 w-3.5 shrink-0" />;
                  })()}
                  <span>{meta.label}</span>
                </>
              ) : (
                "All"
              )}
              <span className={`num rounded-full px-1.5 py-0.5 text-[10px] ${
                isActive ? "bg-primary-foreground/20" : "bg-muted"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <AuditTable
        txs={txs}
        filtered={filtered}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedIds(new Set())}
        onSelectTx={setSelectedTx}
        onUpdateAuditStatus={actions.updateAuditStatus}
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
