/**
 * Audit Queue Feature — Audit Table Component & Bulk Actions
 */
import { formatIDR, severityStyles } from "@/lib/safer-data";
import { Link } from "@tanstack/react-router";
import { ClipboardList, ArrowUpRight } from "lucide-react";
import { AUDIT_STATUS_META, type AuditStatus, type Transaction } from "@/lib/transaction-store";
import { AuditStatusBadge, AUDIT_STATUS_ICONS } from "@/components/safer/AuditStatusBadge";

interface AuditTableProps {
  txs: Transaction[];
  filtered: Transaction[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onBulkAction: (status: AuditStatus) => void;
  onClearSelection: () => void;
  onSelectTx: (tx: Transaction) => void;
  onUpdateAuditStatus: (id: string, status: AuditStatus) => void;
}

export function AuditTable({
  txs,
  filtered,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkAction,
  onClearSelection,
  onSelectTx,
  onUpdateAuditStatus,
}: AuditTableProps) {
  if (txs.length === 0) {
    return (
      <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card p-16 text-center">
        <div>
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <div className="mt-4 text-lg font-semibold">No transactions to audit</div>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Go to the monitoring dashboard to generate transactions first.
          </p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open Dashboard <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (filtered.length === 0) return null;

  return (
    <>
      {selectedIds.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-xs font-medium">{selectedIds.size} selected</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">Change status to:</span>
          {(["under_investigation", "planned_audit", "audited_legitimate", "audited_suspicious", "escalated", "blocked", "cleared"] as AuditStatus[]).map((status) => {
            const meta = AUDIT_STATUS_META[status];
            const Icon = AUDIT_STATUS_ICONS[status];
            return (
              <button
                key={status}
                onClick={() => onBulkAction(status)}
                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] border border-border transition-colors hover:bg-accent ${meta.color} ${meta.bg}`}
              >
                <Icon className="h-3 w-3 shrink-0" />
                <span>{meta.label}</span>
              </button>
            );
          })}
          <button
            onClick={onClearSelection}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={onToggleSelectAll}
                    className="rounded accent-primary"
                  />
                </th>
                <th className="px-4 py-2.5 text-left font-medium">Time</th>
                <th className="px-4 py-2.5 text-left font-medium">Tx ID</th>
                <th className="px-4 py-2.5 text-left font-medium">Sender → Merchant</th>
                <th className="px-4 py-2.5 text-left font-medium">Rail</th>
                <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                <th className="px-4 py-2.5 text-right font-medium">Score</th>
                <th className="px-4 py-2.5 text-right font-medium">Severity</th>
                <th className="px-4 py-2.5 text-left font-medium">Audit Status</th>
                <th className="px-4 py-2.5 text-left font-medium">Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((t) => {
                const sv = severityStyles[t.scoring.severity];
                return (
                  <tr key={t.raw.id} className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(t.raw.id)}
                        onChange={() => onToggleSelect(t.raw.id)}
                        className="rounded accent-primary"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground num whitespace-nowrap">
                      {t.raw.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => onSelectTx(t)} className="font-mono text-xs text-primary hover:underline">
                        {t.raw.id}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 max-w-[200px]">
                      <div className="truncate text-sm">{t.raw.senderName}</div>
                      <div className="truncate text-xs text-muted-foreground">→ {t.raw.merchant}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-accent px-1.5 py-0.5 text-[10px]">{t.raw.rail}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right num whitespace-nowrap">{formatIDR(t.raw.amount)}</td>
                    <td className="px-4 py-2.5 text-right num font-medium">{t.scoring.score}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${sv.bg} ${sv.text}`}>{sv.label}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <AuditStatusBadge status={t.auditStatus} />
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={t.auditStatus}
                        onChange={(e) => onUpdateAuditStatus(t.raw.id, e.target.value as AuditStatus)}
                        className="h-7 rounded border border-input bg-background px-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {Object.entries(AUDIT_STATUS_META).map(([key, meta]) => (
                          <option key={key} value={key}>{meta.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length > 100 && (
            <div className="border-t border-border px-4 py-2.5 text-center text-xs text-muted-foreground">
              Showing 100 of {filtered.length} transactions.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
